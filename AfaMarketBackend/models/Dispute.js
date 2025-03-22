const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Agent involved
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who raised the dispute
    status: { type: String, enum: ['Raised', 'Under Review', 'Resolved', 'Closed'], default: 'Raised' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Assigned admin
    escrowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Escrow',
      required: false, // A dispute could be linked to an escrow or a transaction
    },
    otherReason: { type: String }, // Optional custom reason
    reason: { 
      type: String, 
      required: true, 
      enum: ['fraud', 'delayed delivery', 'wrong product', 'service issue', 'other'], // Specific reasons for the dispute
    },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolution: { type: String, enum: ['refund', 'release'] },
    resolvedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Admin who resolved the dispute
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model('Dispute', DisputeSchema);
