const Dispute = require('../models/Dispute');
const Escrow = require('../models/Escrow');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Raise a dispute
exports.raiseDispute = async (req, res) => {
  const { escrowId, reason } = req.body;

  try {
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    if (escrow.status !== 'pending') {
      return res.status(400).json({ message: 'Dispute can only be raised for pending escrows' });
    }

    const dispute = new Dispute({
      escrowId,
      userId: req.userId,
      reason,
    });
    await dispute.save();

    res.status(200).json({
      message: 'Dispute raised successfully',
      dispute,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new dispute for transactions
exports.createDispute = async (req, res) => {
  try {
    const { transactionId, buyerId, agentId, reason } = req.body;

    // Validate required fields
    if (!transactionId || !buyerId || !agentId || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if transaction exists and is in a disputable state
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if the transaction is already completed or resolved
    if (transaction.status === 'Completed' || transaction.status === 'Resolved') {
      return res.status(400).json({ error: 'This transaction is already completed or resolved' });
    }

    // Create a dispute
    const dispute = new Dispute({
      transactionId,
      buyerId,
      agentId,
      messages: [{ senderId: buyerId, message: reason }],
    });

    await dispute.save();

    // Send notifications to buyer, agent, and admins
    const notificationBuyer = new Notification({
      userId: buyerId,
      message: `A dispute has been created for your transaction with Agent ${agentId}`,
      type: 'Dispute',
    });
    await notificationBuyer.save();

    const notificationAgent = new Notification({
      userId: agentId,
      message: `A dispute has been created for your transaction with Buyer ${buyerId}`,
      type: 'Dispute',
    });
    await notificationAgent.save();

    // Optionally, send admin notifications as well
    const adminNotification = new Notification({
      userId: 'adminId',  // Replace with actual admin ID or dynamic logic
      message: `A new dispute has been created for transaction ${transactionId}.`,
      type: 'Dispute',
    });
    await adminNotification.save();

    res.json({ message: 'Dispute created successfully', dispute });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the dispute', details: error.message });
  }
};

// Send a message in an existing dispute
exports.sendMessage = async (req, res) => {
  try {
    const { disputeId, senderId, message } = req.body;

    // Validate required fields
    if (!disputeId || !senderId || !message) {
      return res.status(400).json({ error: 'Dispute ID, sender ID, and message are required' });
    }

    // Find the dispute
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Add message to the dispute
    dispute.messages.push({ senderId, message });
    await dispute.save();

    // Send a notification for the new message
    const notificationMessage = new Notification({
      userId: senderId,
      message: `You have sent a message in the dispute for transaction ${dispute.transactionId}`,
      type: 'Dispute',
    });
    await notificationMessage.save();

    res.json({ message: 'Message sent successfully', dispute });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sending the message', details: error.message });
  }
};

// Resolve a dispute
exports.resolveDispute = async (req, res) => {
  try {
    const { disputeId, resolution, adminId } = req.body;

    // Validate required fields
    if (!disputeId || !resolution || !adminId) {
      return res.status(400).json({ error: 'Dispute ID, resolution, and admin ID are required' });
    }

    // Find the dispute
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Mark the dispute as resolved
    dispute.status = 'Resolved';
    dispute.resolution = resolution;
    dispute.resolvedByAdmin = adminId;
    await dispute.save();

    // Notify the buyer, agent, and admin about the resolution
    const notificationBuyer = new Notification({
      userId: dispute.buyerId,
      message: `Your dispute for transaction ${dispute.transactionId} has been resolved by Admin ${adminId}`,
      type: 'Dispute',
    });
    await notificationBuyer.save();

    const notificationAgent = new Notification({
      userId: dispute.agentId,
      message: `The dispute for your transaction ${dispute.transactionId} has been resolved by Admin ${adminId}`,
      type: 'Dispute',
    });
    await notificationAgent.save();

    const notificationAdmin = new Notification({
      userId: adminId,
      message: `You have resolved the dispute for transaction ${dispute.transactionId}`,
      type: 'Dispute',
    });
    await notificationAdmin.save();

    res.json({ message: 'Dispute resolved successfully', dispute });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while resolving the dispute', details: error.message });
  }
};

// Close a dispute
exports.closeDispute = async (req, res) => {
  const { disputeId } = req.body;

  try {
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    if (dispute.status !== 'resolved') {
      return res.status(400).json({ message: 'This dispute is not resolved yet' });
    }

    dispute.status = 'closed';
    await dispute.save();

    res.status(200).json({
      message: 'Dispute closed successfully',
      dispute,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all disputes
exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('buyerId agentId resolvedByAdmin')
      .populate('transactionId'); // Optionally populate transaction details as well

    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching disputes', details: error.message });
  }
};
