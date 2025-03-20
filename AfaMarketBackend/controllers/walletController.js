// Required dependencies
const dotenv = require('dotenv');
dotenv.config();
const Flutterwave = require('flutterwave-node-v3');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction'); // Ensure this import exists
const nodemailer = require('nodemailer');
const twilio = require('twilio');


// Initialize Flutterwave API
const flutterwave = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

// Twilio Setup
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Create notification function with optional SMS and Email

const createNotification = async (userId, message, type, phoneNumber, email) => {
    try {
        await Notification.create({ userId, message, type });
        if (phoneNumber) await sendSMS(phoneNumber, message);
        if (email) await sendEmail(email, message);
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

const sendSMS = async (phoneNumber, message) => {
    try {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

const sendEmail = async (email, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Notification from your Marketplace App',
            text: message,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const deposit = async (req, res) => {
    try {
        const { userId, amount, mobileMoneyNumber, provider } = req.body;
        if (!userId || !amount || !mobileMoneyNumber || !provider) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const transactionReference = `deposit-${Date.now()}-${userId}`;
        const paymentResponse = await flutterwave.MobileMoney.charge({
            tx_ref: transactionReference,
            amount,
            currency: 'XAF',
            redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL,
            payment_type: provider,
            phone_number: mobileMoneyNumber,
        });

        if (paymentResponse.status !== 'success') {
            return res.status(400).json({ error: 'Mobile Money deposit failed' });
        }

        let wallet = await Wallet.findOne({ userId }) || new Wallet({ userId, balance: 0, transactions: [] });
        wallet.balance += amount;
        wallet.transactions.push({ type: 'deposit', amount, mobileMoneyNumber, transactionReference, status: 'completed' });
        await wallet.save();

        await Transaction.create({ userId, transactionType: 'deposit', amount, status: 'completed', transactionReference, paymentMethod: 'flutterwave' });
        const user = await User.findById(userId);
        createNotification(userId, `Your deposit of ${amount} XAF was successful.`, 'transaction', user.phoneNumber, user.email);

        res.json({ message: 'Deposit successful', wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const withdraw = async (req, res) => {
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
        const transferResponse = await flutterwave.Transfer.initiate({
            account_bank: provider === 'mtn' ? 'MTN' : 'ORANGE',
            account_number: mobileMoneyNumber,
            amount,
            currency: 'XAF',
            reference: transactionReference,
            narration: 'Wallet withdrawal',
            beneficiary_name: 'User',
        });

        if (transferResponse.status !== 'success') {
            return res.status(400).json({ error: 'Withdrawal failed' });
        }

        wallet.balance -= amount;
        wallet.transactions.push({ type: 'withdraw', amount, mobileMoneyNumber, transactionReference, status: 'completed' });
        await wallet.save();

        const user = await User.findById(userId);
        createNotification(userId, `Your withdrawal of ${amount} XAF was successful.`, 'transaction', user.phoneNumber, user.email);

        res.json({ message: 'Withdrawal successful', wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 🟢 Transfer Funds Between Users (In-App) with Escrow
// 🟢 Transfer Funds Between Users (In-App) with Escrow
const transfer = async (req, res) => {
    try {
        const { senderId, recipientIdentifier, amount } = req.body;

        if (!senderId || !recipientIdentifier || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

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

        const recipientId = recipient._id;
        let senderWallet = await Wallet.findOne({ userId: senderId });

        if (!senderWallet || senderWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transactionReference = `transfer-${Date.now()}-${senderId}`;

        senderWallet.balance -= amount;
        senderWallet.transactions.push({
            type: 'transfer',
            amount,
            recipientId,
            transactionReference,
            status: 'escrow',
        });

        await senderWallet.save();
        const sender = await User.findById(senderId);
        createNotification(senderId, `You sent ${amount} XAF to ${recipient.username || recipient.phoneNumber}, but the funds are held in escrow.`, 'transaction', sender.phoneNumber, sender.email);
        createNotification(recipientId, `You have a pending transfer of ${amount} XAF from ${sender.username || sender.phoneNumber}. Funds are in escrow.`, 'transaction', recipient.phoneNumber, recipient.email);

        res.json({ message: 'Transfer initiated and funds are held in escrow', transactionReference });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Release Escrow Funds to Recipient
const releaseEscrow = async (req, res) => {
    try {
        const { senderId, transactionReference } = req.body;

        if (!senderId || !transactionReference) {
            return res.status(400).json({ error: 'Sender ID and transaction reference are required' });
        }

        let senderWallet = await Wallet.findOne({ userId: senderId });
        if (!senderWallet) return res.status(400).json({ error: 'Sender wallet not found' });

        let transaction = senderWallet.transactions.find(t => t.transactionReference === transactionReference);
        if (!transaction || transaction.status !== 'escrow') {
            return res.status(400).json({ error: 'Transaction not found or invalid status' });
        }

        const recipientId = transaction.recipientId;
        let recipientWallet = await Wallet.findOne({ userId: recipientId });
        if (!recipientWallet) return res.status(400).json({ error: 'Recipient wallet not found' });

        recipientWallet.balance += transaction.amount;
        recipientWallet.transactions.push({
            type: 'received',
            amount: transaction.amount,
            senderId,
            transactionReference,
            status: 'completed',
        });

        transaction.status = 'completed';
        await senderWallet.save();
        await recipientWallet.save();

        const recipient = await User.findById(recipientId);
        createNotification(recipientId, `You have received ${transaction.amount} XAF from escrow.`, 'transaction', recipient.phoneNumber, recipient.email);

        res.json({ message: 'Funds released successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Raise a Dispute for an Escrow Transaction
const raiseDispute = async (req, res) => {
    try {
        const { senderId, transactionReference, reason } = req.body;

        if (!senderId || !transactionReference || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let senderWallet = await Wallet.findOne({ userId: senderId });
        let transaction = senderWallet.transactions.find(t => t.transactionReference === transactionReference && t.status === 'escrow');

        if (!transaction) return res.status(400).json({ error: 'Escrow transaction not found' });

        transaction.status = 'disputed';
        await senderWallet.save();

        createNotification(senderId, `Your transaction has been disputed. Reason: ${reason}`, 'dispute', senderWallet.phoneNumber, senderWallet.email);
        res.json({ message: 'Dispute raised successfully', transactionReference, reason });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Resolve Dispute (Admin Action)
const resolveDispute = async (req, res) => {
    try {
        const { adminId, transactionReference, decision } = req.body;

        if (!adminId || !transactionReference || !decision) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let senderWallet = await Wallet.findOne({ 'transactions.transactionReference': transactionReference, 'transactions.status': 'disputed' });
        if (!senderWallet) return res.status(400).json({ error: 'Disputed transaction not found' });

        let transaction = senderWallet.transactions.find(t => t.transactionReference === transactionReference);

        if (decision === 'resolve') {
            let recipientWallet = await Wallet.findOne({ userId: transaction.recipientId });
            if (!recipientWallet) return res.status(400).json({ error: 'Recipient wallet not found' });

            recipientWallet.balance += transaction.amount;
            transaction.status = 'resolved';
            await recipientWallet.save();
        } else {
            transaction.status = 'reversed';
        }

        await senderWallet.save();
        res.json({ message: 'Dispute resolved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Get Wallet Balance
const getWalletBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
        res.json({ success: true, balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch balance', error: error.message });
    }
};

const walletController = { transfer,deposit, withdraw, releaseEscrow, raiseDispute, resolveDispute, getWalletBalance };
module.exports = walletController;
