const Escrow = require('../models/Escrow'); // Import Escrow model
const Transaction = require('../models/Transaction'); // Import Transaction model
const { validationResult } = require('express-validator'); // Import express-validator if you want to add validation

// Create a new escrow and transaction
exports.createEscrowTransaction = async (req, res) => {
  const { buyerId, sellerId, amount, escrowReference, buyerWallet } = req.body;

  if (!buyerId || !sellerId || !amount || !escrowReference || !buyerWallet) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create the transaction for the escrow
    const newTransaction = new Transaction({
      userId: buyerId,
      transactionType: 'escrow',
      amount: amount,
      status: 'pending',
      transactionReference: escrowReference,
      walletBalanceBefore: buyerWallet.balance,
      walletBalanceAfter: buyerWallet.balance - amount,
      paymentMethod: 'mobile_money',
      escrowReference: escrowReference,
    });

    await newTransaction.save();

    // Create the escrow object
    const newEscrow = new Escrow({
      buyer: buyerId,
      seller: sellerId,
      amount: amount,
      status: 'pending',
      escrowReference: escrowReference,
      transactionHistory: [
        {
          action: 'created',
          performedBy: buyerId,
          details: 'Escrow created successfully.',
        }
      ],
    });

    await newEscrow.save();

    res.status(201).json({
      message: 'Escrow and transaction created successfully',
      escrow: newEscrow,
      transaction: newTransaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the escrow' });
  }
};

// 🟢 Release Funds to Seller (Client or Admin triggers)
exports.releaseFunds = async (req, res) => {
  const { escrowReference } = req.params;

  try {
    // Find the escrow by the reference
    const escrow = await Escrow.findOne({ escrowReference });

    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }

    // Check if the escrow is in 'pending' status
    if (escrow.status !== 'pending') {
      return res.status(400).json({ message: 'Escrow is not in a pending state' });
    }

    // Proceed to release funds
    escrow.status = 'completed'; // Change status to 'completed' to mark that funds are released
    await escrow.save();

    // You may want to update the transaction status for the release
    const transaction = await Transaction.findOne({ escrowReference });
    if (transaction) {
      transaction.status = 'completed';
      await transaction.save();
    }

    res.status(200).json({
      message: 'Funds released successfully',
      escrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while releasing the funds' });
  }
};

// Get all escrows
exports.getAllEscrows = async (req, res) => {
  try {
    const escrows = await Escrow.find()
      .populate('buyer', 'name email') // Populate buyer information
      .populate('seller', 'name email') // Populate seller information
      .exec();

    res.status(200).json({
      message: 'Escrows retrieved successfully',
      escrows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the escrows' });
  }
};

// Get a specific escrow by escrowReference
exports.getEscrowByReference = async (req, res) => {
  const { escrowReference } = req.params;

  try {
    const escrow = await Escrow.findOne({ escrowReference })
      .populate('buyer', 'name email') // Populate buyer information
      .populate('seller', 'name email') // Populate seller information
      .exec();

    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }

    res.status(200).json({
      message: 'Escrow retrieved successfully',
      escrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the escrow' });
  }
};

// Resolve dispute for an escrow (admin intervention)
exports.resolveDispute = async (req, res) => {
  const { escrowReference, adminId, resolutionDetails } = req.body;

  try {
    const escrow = await Escrow.findOne({ escrowReference });

    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }

    // Resolve dispute
    await escrow.resolveDispute(adminId, resolutionDetails);

    res.status(200).json({
      message: 'Dispute resolved successfully',
      escrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while resolving the dispute' });
  }
};

// Cancel an escrow
exports.cancelEscrow = async (req, res) => {
  const { escrowReference, cancelBy } = req.body;

  try {
    const escrow = await Escrow.findOne({ escrowReference });

    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }

    // Cancel the escrow
    await escrow.cancelEscrow(cancelBy);

    res.status(200).json({
      message: 'Escrow cancelled successfully',
      escrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while canceling the escrow' });
  }
};
