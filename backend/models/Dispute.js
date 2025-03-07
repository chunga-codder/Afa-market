const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
    escrowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Escrow",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "resolved", "closed"],
        default: "open",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Dispute", disputeSchema);
