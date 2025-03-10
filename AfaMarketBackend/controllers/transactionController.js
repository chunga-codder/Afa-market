const Transaction = require("../models/Transaction");
const Escrow = require("../models/Escrow");
const User = require("../models/User");
const { sendNotification } = require("./notificationController");
const { sendSMS } = require("../utils/sendSMS");
const { sendPushNotification } = require("../utils/sendPushNotification");

// Helper function to create a new transaction
const createTransaction = async (userId, transactionType, amount, recipientId = null, escrowId = null, status = "completed") => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const transaction = new Transaction({
        provider: userId,  // Assuming the user is the provider and consumer
        consumer: userId,  // Adjust as needed based on actual provider/consumer relationship
        transactionType,
        amount,
        balanceAfterTransaction: user.walletBalance,
        status,
        recipientId,
        escrowId,
    });

    await transaction.save();
    return transaction; // Return the transaction object
};

// Rate a service provider after completing a transaction
export async function rateTransaction(req, res) {
    const { transactionId, rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found." });

        if (transaction.transactionStatus !== "completed") {
            return res.status(400).json({ message: "Only completed transactions can be rated." });
        }

        // Update the transaction with the rating
        transaction.rating = rating;
        transaction.transactionStatus = "rated"; // Mark transaction as rated

        // Save the updated transaction
        await transaction.save();

        // Update the provider's rating
        const provider = await User.findById(transaction.provider);
        if (provider) {
            provider.ratings.push(rating);
            const totalRatings = provider.ratings.reduce((sum, rate) => sum + rate, 0);
            provider.averageRating = totalRatings / provider.ratings.length;
            await provider.save();
        }

        res.status(200).json({ message: "Rating submitted successfully!" });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Error submitting rating" });
    }
}

// Deposit Funds (record as deposit)
exports.depositFunds = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        user.walletBalance += amount;
        await user.save();

        const transaction = await createTransaction(req.user.id, "deposit", amount);

        res.status(200).json({
            message: "Deposit successful",
            walletBalance: user.walletBalance,
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Withdraw Funds (record as withdrawal)
exports.withdrawFunds = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.walletBalance -= amount;
        await user.save();

        const transaction = await createTransaction(req.user.id, "withdrawal", amount);

        res.status(200).json({
            message: "Withdrawal successful",
            walletBalance: user.walletBalance,
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Transfer Funds (record as transfer)
exports.transferFunds = async (req, res) => {
    const { recipientId, amount } = req.body;

    try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findById(recipientId);
        if (!sender || !recipient) return res.status(404).json({ message: "User(s) not found" });

        if (amount <= 0 || sender.walletBalance < amount) {
            return res.status(400).json({ message: "Invalid amount or insufficient balance" });
        }

        sender.walletBalance -= amount;
        recipient.walletBalance += amount;

        await sender.save();
        await recipient.save();

        const transaction = await createTransaction(req.user.id, "transfer", amount, recipientId);

        res.status(200).json({
            message: "Transfer successful",
            senderWalletBalance: sender.walletBalance,
            recipientWalletBalance: recipient.walletBalance,
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Create Escrow (place funds in escrow)
exports.createEscrow = async (req, res) => {
    const { jobId, amount, recipientId } = req.body;

    try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findById(recipientId);
        if (!sender || !recipient) return res.status(404).json({ message: "User(s) not found" });

        if (sender.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        sender.walletBalance -= amount;
        await sender.save();

        const escrow = new Escrow({
            jobId,
            amount,
            senderId: sender._id,
            recipientId: recipient._id,
        });
        await escrow.save();

        const transaction = await createTransaction(req.user.id, "escrow", amount, recipientId, escrow._id, "pending");

        res.status(200).json({
            message: "Escrow created successfully",
            senderWalletBalance: sender.walletBalance,
            escrow,
            transaction,
        });

        // Send notifications
        await sendNotification(sender._id, "transaction", "Your payment was successfully processed.");
        await sendSMS(sender.phone, "Your payment was processed successfully.");
        await sendPushNotification(sender.fcmToken, "Payment Successful", "Your payment was completed.");
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Complete Escrow (release funds)
exports.completeEscrow = async (req, res) => {
    const { escrowId } = req.body;

    try {
        const escrow = await Escrow.findById(escrowId);
        if (!escrow) return res.status(404).json({ message: "Escrow not found" });

        escrow.status = "completed";
        await escrow.save();

        const sender = await User.findById(escrow.senderId);
        const recipient = await User.findById(escrow.recipientId);
        if (!sender || !recipient) return res.status(404).json({ message: "User(s) not found" });

        recipient.walletBalance += escrow.amount;
        await recipient.save();

        const transaction = await createTransaction(
            sender._id,
            "escrow",
            escrow.amount,
            recipient._id,
            escrowId,
            "completed"
        );

        res.status(200).json({
            message: "Escrow completed, funds released",
            senderWalletBalance: sender.walletBalance,
            recipientWalletBalance: recipient.walletBalance,
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Approve a transaction (Super Admin Control)
exports.approveTransaction = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Approve the transaction
        transaction.status = "completed";
        await transaction.save();

        res.status(200).json({
            message: "Transaction approved successfully",
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Reject a transaction (Super Admin Control)
exports.rejectTransaction = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Reject the transaction
        transaction.status = "failed";
        await transaction.save();

        res.status(200).json({
            message: "Transaction rejected successfully",
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
