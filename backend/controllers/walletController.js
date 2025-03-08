const User = require("../models/User");
const Flutterwave = require("flutterwave-node-v3"); // For Flutterwave integration
require("dotenv").config();
// Initialize Flutterwave
const flutterwave = new Flutterwave(process.env.FLUTTERWAVE_SECRET_KEY);

// Deposit Funds
exports.depositFunds = async (req, res) => {
    const { amount, paymentMethod } = req.body; // e.g., Mobile Money (MTN or Orange)

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Validate amount
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        // Flutterwave API to process the deposit (Example: MTN Mobile Money)
        const paymentData = {
            tx_ref: `TX-${Date.now()}`,
            amount: amount,
            currency: "XAF", // Cameroon currency
            payment_type: paymentMethod, // MTN or Orange
            email: user.email,
            redirect_url: `${process.env.FRONTEND_URL}/deposit-success`, // URL to redirect after success
        };

        flutterwave.ChargeMobileMoney(paymentData, async (status, response) => {
            if (status === "success") {
                user.walletBalance += amount; // Add amount to wallet
                await user.save();

                res.status(200).json({
                    message: "Deposit successful",
                    walletBalance: user.walletBalance,
                    paymentInfo: response,
                });
            } else {
                res.status(400).json({ message: "Deposit failed", error: response });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Withdraw Funds
exports.withdrawFunds = async (req, res) => {
    const { amount, paymentMethod } = req.body; // e.g., Mobile Money (MTN or Orange)

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user has sufficient balance
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Flutterwave API to process withdrawal
        const withdrawalData = {
            tx_ref: `TX-WITHDRAW-${Date.now()}`,
            amount: amount,
            currency: "XAF", // Cameroon currency
            payment_type: paymentMethod, // MTN or Orange
            email: user.email,
            redirect_url: `${process.env.FRONTEND_URL}/withdraw-success`, // URL to redirect after success
        };

        flutterwave.ChargeMobileMoney(withdrawalData, async (status, response) => {
            if (status === "success") {
                user.walletBalance -= amount; // Deduct amount from wallet
                await user.save();

                res.status(200).json({
                    message: "Withdrawal successful",
                    walletBalance: user.walletBalance,
                    paymentInfo: response,
                });
            } else {
                res.status(400).json({ message: "Withdrawal failed", error: response });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Transfer Funds to Another User
exports.transferFunds = async (req, res) => {
    const { recipientId, amount } = req.body;

    try {
        const sender = await User.findById(req.userId);
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ message: "Recipient not found" });

        // Validate amount
        if (amount <= 0 || sender.walletBalance < amount) {
            return res.status(400).json({ message: "Invalid amount or insufficient balance" });
        }

        // Transfer funds
        sender.walletBalance -= amount;
        recipient.walletBalance += amount;

        await sender.save();
        await recipient.save();

        res.status(200).json({
            message: "Transfer successful",
            senderWalletBalance: sender.walletBalance,
            recipientWalletBalance: recipient.walletBalance,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
