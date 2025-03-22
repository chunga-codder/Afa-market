const Booking = require('../models/Booking');
const Chat = require('../models/Chat');  // ✅ Added missing import
const Escrow = require('../models/Escrow');
// const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// 1️⃣ Create Booking Request (Negotiation Phase)
const createBookingRequest = async (req, res) => {
  const { buyerId, sellerId, service, initialAmount } = req.body;

  if (!buyerId || !sellerId || !service || !initialAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newBooking = new Booking({
      buyer: buyerId,
      seller: sellerId,
      service,
      initialAmount,
      status: "negotiation", // Chat phase before confirmation
    });

    await newBooking.save();

    // 🔥 Auto-create chat when booking starts
    let chat = await Chat.findOne({ participants: { $all: [buyerId, sellerId] } });

    if (!chat) {
      chat = new Chat({ participants: [buyerId, sellerId], messages: [] });
      await chat.save();
    }

    res.status(201).json({
      message: "Booking request created. Chat open for negotiation.",
      booking: newBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating booking request" });
  }
};

// 2️⃣ User Sends "Book Now" Request (Negotiation Done)
const bookNow = async (req, res) => {
  const { bookingId } = req.params;
  const { negotiatedAmount } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'negotiation') {
      return res.status(400).json({ message: 'Booking is not in negotiation phase' });
    }

    // ✅ Auto-checking Wallet Balance Before Booking
    const wallet = await Wallet.findOne({ userId: booking.buyer });
    if (!wallet || wallet.balance < negotiatedAmount) {
      return res.status(400).json({ message: 'Insufficient balance. Please deposit funds.' });
    }

    booking.negotiatedAmount = negotiatedAmount;
    booking.status = 'awaiting_agent_confirmation';
    await booking.save();

    res.json({ message: 'Booking sent for agent confirmation.', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending booking for confirmation' });
  }
};

// 3️⃣ Agent Confirms Booking (Escrow Holds Funds)
const acceptBooking = async (req, res) => {
  const { bookingId } = req.params;
  const loggedInUserId = req.user.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.seller.toString() !== loggedInUserId) {
      return res.status(403).json({ message: "Unauthorized to approve this booking" });
    }

    if (booking.status !== "awaiting_agent_confirmation") {
      return res.status(400).json({ message: "Booking is not awaiting confirmation" });
    }

    const newEscrow = new Escrow({
      buyer: booking.buyer,
      seller: booking.seller,
      amount: booking.negotiatedAmount,
      status: "held",
      escrowReference: booking._id,
    });

    await newEscrow.save();

    booking.status = "confirmed";
    await booking.save();

    // 🔥 Send system message to chat
    const chat = await Chat.findOne({ participants: { $all: [booking.buyer, booking.seller] } });
    if (chat) {
      chat.messages.push({
        sender: "system",
        message: "Booking confirmed! Escrow funds are now held.",
        timestamp: Date.now(),
        bookingId: bookingId,
      });
      await chat.save();
    }

    res.status(200).json({
      message: "Booking approved, escrow created, and funds held.",
      booking,
      escrow: newEscrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error approving booking" });
  }
};


// 4️⃣ Agent Declines Booking
const declineBooking = async (req, res) => {
  const { bookingId } = req.params;
  const loggedInUserId = req.user.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.seller.toString() !== loggedInUserId) {
      return res.status(403).json({ message: 'Unauthorized to decline this booking' });
    }

    if (booking.status !== 'awaiting_agent_confirmation') {
      return res.status(400).json({ message: 'Booking is not awaiting approval' });
    }

    booking.status = 'declined';
    await booking.save();

    res.status(200).json({
      message: 'Booking request declined by agent.',
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error declining booking' });
  }
};

// 5️⃣ Release Escrow (Booking Completed)
const completeBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Booking is not confirmed yet.' });
    }

    // Release escrow funds
    const escrow = await Escrow.findOne({ escrowReference: booking._id });
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    escrow.status = 'released';
    escrow.transactionHistory.push({
      action: 'released',
      performedBy: booking.buyer,
      details: 'Escrow funds released after service completion.',
    });

    await escrow.save();

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Service completed. Escrow funds released.', booking, escrow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error completing booking' });
  }
};

module.exports = {
  createBookingRequest,
  bookNow,
  acceptBooking,
  declineBooking,
  completeBooking,
};
