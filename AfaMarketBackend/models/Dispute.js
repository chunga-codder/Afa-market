const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // Linking to the Transaction model
      required: true,
    },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    disputeStatus: { type: String, enum: ['none', 'raised', 'resolved'], default: 'none' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'Resolved', 'Pending', 'Rejected'], default: 'Open' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Assigned admin
    reason: {
      type: String,
      required: true,
      enum: ['fraud', 'delayed delivery', 'wrong product', 'service issue', 'other'], // Define specific reasons for the dispute
    },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolution: { type: String, enum: ['refund', 'release'] },
    resolvedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Reference to Admin model
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Middleware to update `updatedAt` field on any change
DisputeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dispute', DisputeSchema);
