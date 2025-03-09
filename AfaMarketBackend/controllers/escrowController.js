const Escrow = require('../models/Escrow');
const { createNotification } = require('./notificationController');
const Flutterwave = require('flutterwave-node-v3');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Flutterwave
const flutterwave = new Flutterwave(process.env.FLUTTERWAVE_SECRET_KEY);

// 🟢 Create Escrow Transaction (Buyer Pays via Mobile Money)
exports.createEscrow = async (req, res) => {
  try {
    const { buyer, seller, amount, paymentReference, momoNumber, momoProvider } = req.body;

    // Ensure required data is provided
    if (!momoNumber || !momoProvider) return res.status(400).json({ error: 'Mobile Money details required' });

    const escrow = new Escrow({
      buyer,
      seller,
      amount,
      status: 'pending',
      paymentReference,
      releaseTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Auto-release in 48 hours
    });

    // Charge buyer via MoMo
    const paymentResponse = await flutterwave.MobileMoney.charge({
      tx_ref: paymentReference,
      amount,
      currency: 'XAF', // Correct currency for Cameroon
      redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL,
      payment_type: momoProvider, // "mtn" or "orange"
      phone_number: momoNumber, // Buyer's MoMo Number
    });

    if (paymentResponse.status !== 'success') {
      return res.status(400).json({ error: 'Payment failed' });
    }

    await escrow.save();
    res.status(201).json({ message: 'Escrow created successfully', escrow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Release Funds to Seller (Client or Admin triggers)
exports.releaseFunds = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId).populate('buyer seller');

  if (!escrow) throw new Error('Escrow not found');
  if (escrow.status !== 'pending') throw new Error('Escrow is not eligible for release');

  try {
    const momoProvider = escrow.seller.momoProvider; // Ensure seller's MoMo provider is stored
    if (!momoProvider) throw new Error('Seller has no Mobile Money provider set');

    // Transfer funds to seller's MoMo account
    const transferResponse = await flutterwave.Transfer.initiate({
      account_bank: momoProvider, // "mtn" or "orange"
      account_number: escrow.seller.momoNumber, // Seller's MoMo number
      amount: escrow.amount,
      currency: 'XAF',
      reference: `escrow-release-${escrow._id}`,
      callback_url: process.env.FLUTTERWAVE_REDIRECT_URL,
      narration: 'Escrow fund release',
    });

    if (transferResponse.status === 'success') {
      // Send notification to the buyer that their funds have been released
      const userId = escrow.buyer._id; // or escrow.seller._id depending on the context
      const userPhoneNumber = escrow.buyer.phoneNumber; // assuming buyer has phoneNumber field
      const userEmail = escrow.buyer.email; // assuming buyer has email field

      createNotification(userId, 'Your funds have been released from escrow', 'escrow', userPhoneNumber, userEmail);

      // Mark escrow as released
      escrow.status = 'released';
      await escrow.save();
      return transferResponse;
    } else {
      throw new Error('Flutterwave Mobile Money transfer failed');
    }
  } catch (error) {
    throw new Error(`Error releasing funds: ${error.message}`);
  }
};

// 🟢 Handle Dispute Creation
exports.createDispute = async (req, res) => {
  try {
    const { escrowId, buyerId, reason } = req.body;
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

    escrow.status = 'disputed';
    escrow.disputeReason = reason;
    await escrow.save();

    res.json({ message: 'Dispute created successfully', escrow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Resolve Dispute (Admin Decision)
exports.resolveDispute = async (req, res) => {
  try {
    const { escrowId, resolution, adminId, refundBuyer } = req.body;
    const escrow = await Escrow.findById(escrowId).populate('buyer seller');

    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

    // Decide whether to release funds to seller or refund buyer
    const receiver = refundBuyer ? escrow.buyer : escrow.seller;

    const transferResponse = await flutterwave.Transfer.initiate({
      account_bank: receiver.momoProvider, // "mtn" or "orange"
      account_number: receiver.momoNumber, // MoMo Number
      amount: escrow.amount,
      currency: 'XAF',
      reference: `escrow-dispute-${escrow._id}`,
      callback_url: process.env.FLUTTERWAVE_REDIRECT_URL,
      narration: 'Escrow dispute resolution',
    });

    if (transferResponse.status === 'success') {
      // Send notification to both buyer and seller regarding dispute resolution
      const userPhoneNumber = receiver.phoneNumber; // assuming buyer/seller has phoneNumber field
      const userEmail = receiver.email; // assuming buyer/seller has email field
      const message = refundBuyer ? 'Your payment has been refunded' : 'Your payment has been released';

      createNotification(receiver._id, message, 'dispute', userPhoneNumber, userEmail);

      escrow.status = 'released';
      await escrow.save();
      res.json({ message: 'Dispute resolved and funds released', escrow });
    } else {
      throw new Error('Flutterwave transfer failed');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Get All Escrow Transactions (For Admin)
exports.getEscrows = async (req, res) => {
  try {
    const escrows = await Escrow.find().populate('buyer seller');
    res.json(escrows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
