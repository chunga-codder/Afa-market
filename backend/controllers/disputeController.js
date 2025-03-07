const Dispute = require("../models/Dispute");
const Escrow = require("../models/Escrow");

// Raise a dispute
exports.raiseDispute = async (req, res) => {
    const { escrowId, reason } = req.body;

    try {
        const escrow = await Escrow.findById(escrowId);
        if (!escrow) return res.status(404).json({ message: "Escrow not found" });

        if (escrow.status !== "pending") {
            return res.status(400).json({ message: "Dispute can only be raised for pending escrows" });
        }

        const dispute = new Dispute({
            escrowId,
            userId: req.userId,
            reason,
        });
        await dispute.save();

        res.status(200).json({
            message: "Dispute raised successfully",
            dispute,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Resolve a dispute
exports.resolveDispute = async (req, res) => {
    const { disputeId, decision } = req.body; // decision: "refund" or "release"

    try {
        const dispute = await Dispute.findById(disputeId);
        if (!dispute) return res.status(404).json({ message: "Dispute not found" });

        if (dispute.status !== "open") {
            return res.status(400).json({ message: "This dispute is already resolved or closed" });
        }

        dispute.status = "resolved";
        dispute.resolvedAt = Date.now();

        const escrow = await Escrow.findById(dispute.escrowId);
        if (!escrow) return res.status(404).json({ message: "Escrow not found" });

        if (decision === "refund") {
            // Refund the sender
            const sender = await User.findById(escrow.senderId);
            sender.walletBalance += escrow.amount;
            await sender.save();
            escrow.status = "disputed";
        } else if (decision === "release") {
            // Release the funds to the recipient
            const recipient = await User.findById(escrow.recipientId);
            recipient.walletBalance += escrow.amount;
            await recipient.save();
            escrow.status = "completed";
        } else {
            return res.status(400).json({ message: "Invalid decision" });
        }

        await escrow.save();
        await dispute.save();

        res.status(200).json({
            message: `Dispute ${decision} decision made successfully`,
            dispute,
            escrow,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Close a dispute
exports.closeDispute = async (req, res) => {
    const { disputeId } = req.body;

    try {
        const dispute = await Dispute.findById(disputeId);
        if (!dispute) return res.status(404).json({ message: "Dispute not found" });

        if (dispute.status !== "resolved") {
            return res.status(400).json({ message: "This dispute is not resolved yet" });
        }

        dispute.status = "closed";
        await dispute.save();

        res.status(200).json({
            message: "Dispute closed successfully",
            dispute,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
