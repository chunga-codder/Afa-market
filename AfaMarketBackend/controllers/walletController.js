const dotenv = require('dotenv');
require('dotenv').config();
const Flutterwave = require('flutterwave-node-v3');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction'); // Ensure this import exists

const flutterwave = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

// Create notification function
const createNotification = async (userId, message, type, phoneNumber, email) => {
    try {
        // Save notification to the database
        const notification = new Notification({
            userId,
            message,
            type,
        });

        await notification.save();

        // Optionally, you can also send SMS or Email here
        // Example for SMS (using an SMS service like Twilio or a custom implementation)
        // Example for Email (using a service like Nodemailer)

        console.log('Notification created:', notification);
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// 🟢 Deposit Funds via Mobile Money
exports.deposit = async (req, res) => {
    try {
        const { userId, amount, mobileMoneyNumber, provider } = req.body;

        if (!userId || !amount || !mobileMoneyNumber || !provider) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Generate a unique transaction reference
        const transactionReference = `deposit-${Date.now()}-${userId}`;

        // Call Flutterwave to process MoMo payment
        const paymentResponse = await flutterwave.MobileMoney.charge({
            tx_ref: transactionReference,
            amount,
            currency: 'XAF',
            redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL,
            payment_type: provider, // "mtn" or "orange"
            phone_number: mobileMoneyNumber,
        });

        if (paymentResponse.status !== 'success') {
            return res.status(400).json({ error: 'Mobile Money deposit failed' });
        }

        // Update Wallet Balance
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, transactions: [] });
        }

        wallet.balance += amount;
        wallet.transactions.push({
            type: 'deposit',
            amount,
            mobileMoneyNumber,
            transactionReference,
            status: 'completed',
        });

        await wallet.save();

        // Create a transaction record
        const newTransaction = new Transaction({
            userId,
            transactionType: 'deposit',
            amount,
            status: 'pending',
            transactionReference: paymentResponse.tx_ref,
            paymentMethod: 'flutterwave',
        });

        await newTransaction.save();

        // Send notification to user
        const user = await User.findById(userId);
        createNotification(userId, `Your deposit of ${amount} XAF was successful.`, 'transaction', user.phoneNumber, user.email);
        
        res.json({ message: 'Deposit successful', wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Withdraw Funds to Mobile Money
exports.withdraw = async (req, res) => {
    try {
        const { userId, amount, mobileMoneyNumber, provider } = req.body;

        if (!userId || !amount || !mobileMoneyNumber || !provider) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transactionReference = `withdraw-${Date.now()}-${userId}`;

        // Call Flutterwave to send money to the user's MoMo number
        const transferResponse = await flutterwave.MobileMoney.charge({
            tx_ref: transactionReference,
            amount,
            currency: 'XAF',
            redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL,
            payment_type: provider, // "mtn" or "orange"
            phone_number: mobileMoneyNumber,
        });

        if (transferResponse.status !== 'success') {
            return res.status(400).json({ error: 'Withdrawal failed' });
        }

        wallet.balance -= amount;
        wallet.transactions.push({
            type: 'withdraw',
            amount,
            mobileMoneyNumber,
            transactionReference,
            status: 'completed',
        });

        await wallet.save();

        // Send notification to user
        const user = await User.findById(userId);
        createNotification(userId, `Your withdrawal of ${amount} XAF was successful.`, 'transaction', user.phoneNumber, user.email);

        res.json({ message: 'Withdrawal successful', wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Transfer Funds Between Users (In-App) with Escrow
exports.transfer = async (req, res) => {
    try {
        const { senderId, recipientIdentifier, amount } = req.body;

        if (!senderId || !recipientIdentifier || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Find the recipient by username, phone number, or userId
        let recipient;
        if (recipientIdentifier.includes('@')) {
            recipient = await User.findOne({ email: recipientIdentifier });
        } else if (!isNaN(recipientIdentifier)) {
            recipient = await User.findOne({ phoneNumber: recipientIdentifier });
        } else {
            recipient = await User.findOne({ username: recipientIdentifier });
        }

        if (!recipient) {
            return res.status(400).json({ error: 'Recipient not found' });
        }

        const recipientId = recipient._id; // Extract user ID
        let senderWallet = await Wallet.findOne({ userId: senderId });

        if (!senderWallet || senderWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transactionReference = `transfer-${Date.now()}-${senderId}`;

        // Deduct amount from sender's wallet and hold it in escrow
        senderWallet.balance -= amount;
        senderWallet.transactions.push({
            type: 'transfer',
            amount,
            recipientId,
            transactionReference,
            status: 'escrow', // Funds are now held in escrow
        });

        await senderWallet.save();

        // Send notification to both sender and recipient
        const sender = await User.findById(senderId);
        createNotification(senderId, `You sent ${amount} XAF to ${recipient.username || recipient.phoneNumber}, but the funds are held in escrow.`, 'transaction', sender.phoneNumber, sender.email);

        createNotification(recipientId, `You have a pending transfer of ${amount} XAF from ${sender.username || sender.phoneNumber}. Funds are in escrow.`, 'transaction', recipient.phoneNumber, recipient.email);

        res.json({ message: 'Transfer initiated and funds are held in escrow', transactionReference });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Release Escrow Funds to Recipient
exports.releaseEscrow = async (req, res) => {
    try {
        const { senderId, transactionReference } = req.body;

        if (!senderId || !transactionReference) {
            return res.status(400).json({ error: 'Sender ID and transaction reference are required' });
        }

        let senderWallet = await Wallet.findOne({ userId: senderId });
        if (!senderWallet) {
            return res.status(400).json({ error: 'Sender wallet not found' });
        }

        // Find the escrow transaction
        let transaction = senderWallet.transactions.find(
            (t) => t.transactionReference === transactionReference
        );

        if (!transaction) {
            return res.status(400).json({ error: 'Transaction not found' });
        }

        // Ensure the transaction is NOT disputed before proceeding
        if (transaction.status === 'disputed') {
            return res.status(400).json({ error: 'Transaction is disputed and cannot be released' });
        }

        // Ensure the transaction is still in escrow
        if (transaction.status !== 'escrow') {
            return res.status(400).json({ error: 'Transaction already released or invalid status' });
        }

        const recipientId = transaction.recipientId;

        let recipientWallet = await Wallet.findOne({ userId: recipientId });
        if (!recipientWallet) {
            return res.status(400).json({ error: 'Recipient wallet not found' });
        }

        // Transfer funds to recipient
        recipientWallet.balance += transaction.amount;
        recipientWallet.transactions.push({
            type: 'received',
            amount: transaction.amount,
            senderId,
            transactionReference,
            status: 'completed',
        });

        // Update sender's transaction status
        transaction.status = 'completed';

        await senderWallet.save();
        await recipientWallet.save();

        // Notify recipient
        const recipient = await User.findById(recipientId);
        if (recipient) {
            createNotification(
                recipientId,
                `You have received ${transaction.amount} XAF from the escrow transaction.`,
                'transaction',
                recipient.phoneNumber,
                recipient.email
            );
        }

        res.json({ message: 'Funds released successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Raise a Dispute for an Escrow Transaction
exports.raiseDispute = async (req, res) => {
    try {
        const { senderId, transactionReference, reason } = req.body;

        if (!senderId || !transactionReference || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let senderWallet = await Wallet.findOne({ userId: senderId });

        if (!senderWallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }

        // Find the escrow transaction
        let transaction = senderWallet.transactions.find(
            (t) => t.transactionReference === transactionReference && t.status === 'escrow'
        );

        if (!transaction) {
            return res.status(400).json({ error: 'Escrow transaction not found or already released' });
        }

        // Update transaction status to "disputed"
        transaction.status = 'disputed';

        await senderWallet.save();
        const sender = await User.findById(senderId);
        createNotification(senderId, `Your transaction has been disputed. Reason: ${reason}`, 'dispute', sender.phoneNumber, sender.email);

        res.json({ message: 'Dispute raised successfully', transactionReference, reason });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Resolves Dispute
exports.resolveDispute = async (req, res) => {
    try {
        const { senderId, recipientId, transactionReference, decision } = req.body; 
        // decision = "refund" or "release"

        if (!senderId || !recipientId || !transactionReference || !decision) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let senderWallet = await Wallet.findOne({ userId: senderId });
        let recipientWallet = await Wallet.findOne({ userId: recipientId });

        if (!senderWallet || !recipientWallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }

        // Find the escrow transaction
        let transaction = senderWallet.transactions.find(
            (t) => t.transactionReference === transactionReference && t.status === 'disputed'
        );

        if (!transaction) {
            return res.status(400).json({ error: 'Disputed transaction not found' });
        }

        if (decision === 'refund') {
            // Refund the sender
            senderWallet.balance += transaction.amount;
            transaction.status = 'refunded';
        } else if (decision === 'release') {
            // Release funds to recipient
            recipientWallet.balance += transaction.amount;
            recipientWallet.transactions.push({
                type: 'received',
                amount: transaction.amount,
                senderId,
                transactionReference,
                status: 'completed',
            });
            transaction.status = 'completed';
        }

        await senderWallet.save();
        await recipientWallet.save();
        const sender = await User.findById(senderId);
        createNotification(senderId, `Your disputed transaction has been resolved. Reason: ${reason}`, 'dispute', sender.phoneNumber, sender.email);

        res.json({ message: `Dispute resolved: ${decision}`, transactionReference });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
    try {
      const wallet = await Wallet.findOne({ user: req.user.id });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  
      res.json({ balance: wallet.balance, currency: wallet.currency });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


