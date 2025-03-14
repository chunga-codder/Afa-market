const Escrow = require('../models/Escrow'); // Import Escrow model
const Transaction = require('../models/Transaction'); // Import Transaction model

exports.acceptBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending_agent_approval') {
      return res.status(400).json({ message: 'Booking is not pending approval' });
    }

    // Update booking status to "approved"
    booking.status = 'approved';
    await booking.save();

    // Now create escrow transaction
    const newTransaction = new Transaction({
      userId: booking.buyer,
      transactionType: 'escrow',
      amount: booking.amount,
      status: 'pending',
      transactionReference: booking._id, // Use booking ID as reference
      paymentMethod: 'mobile_money',
    });

    await newTransaction.save();

    const newEscrow = new Escrow({
      buyer: booking.buyer,
      seller: booking.seller,
      amount: booking.amount,
      status: 'pending',
      escrowReference: booking._id,
      transactionHistory: [
        {
          action: 'created',
          performedBy: booking.buyer,
          details: 'Escrow created successfully after agent approval.',
        },
      ],
    });

    await newEscrow.save();

    res.status(200).json({
      message: 'Booking approved, escrow created, and funds held.',
      booking,
      escrow: newEscrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while approving the booking' });
  }
};

exports.declineBooking = async (req, res) => {
    const { bookingId } = req.params;
  
    try {
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      if (booking.status !== 'pending_agent_approval') {
        return res.status(400).json({ message: 'Booking is not pending approval' });
      }
  
      // Update booking status to "declined"
      booking.status = 'declined';
      await booking.save();
  
      res.status(200).json({
        message: 'Booking request declined by the agent.',
        booking,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while declining the booking' });
    }
  };

  const Booking = require('../models/Booking'); // Import Booking model

// Create a booking request
exports.createBookingRequest = async (req, res) => {
  const { buyerId, sellerId, service, amount } = req.body;

  if (!buyerId || !sellerId || !service || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new booking
    const newBooking = new Booking({
      buyer: buyerId,
      seller: sellerId,
      service,
      amount,
      status: 'pending_agent_approval', // Waiting for agent approval
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking request created successfully. Awaiting agent approval.',
      booking: newBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the booking' });
  }
};


// Expected Booking Flow
// 1️⃣ Client Books a Service → POST /api/bookings/book-service
// 2️⃣ Agent Sees Pending Request
// 3️⃣ Agent Accepts → Escrow is created (POST /api/bookings/accept-booking/:bookingId)
// 4️⃣ Agent Declines → Booking is marked as declined (POST /api/bookings/decline-booking/:bookingId)
  
