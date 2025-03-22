const mongoose = require('mongoose');

const EscrowSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'released', 'disputed', 'resolved', 'cancelled'],
    default: 'pending'
  },
  escrowReference: {
    type: mongoose.Schema.Types.ObjectId, // Corrected type
    ref: 'Booking',
    required: true
  },
  disputeReason: {
    type: String,
    default: ''
  },
  disputeStatus: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  autoReleaseEnabled: {
    type: Boolean,
    default: false
  },
  releaseTime: {
    type: Date,
    default: null
  },
  transactionHistory: [{
    action: {
      type: String,
      enum: ['created', 'released', 'disputed', 'resolved', 'admin-intervention', 'cancelled'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    details: {
      type: String,
      default: ''
    }
  }]
});

// Automatic fund release
EscrowSchema.methods.releaseFunds = async function () {
  if (this.autoReleaseEnabled && this.releaseTime && new Date() >= this.releaseTime) {
    this.status = 'released';
    this.transactionHistory.push({
      action: 'released',
      performedBy: this.buyer,
      details: 'Automatic fund release triggered.'
    });
    await this.save();
  }
};

// Resolve dispute
EscrowSchema.methods.resolveDispute = async function (adminId, resolutionDetails) {
  this.status = 'resolved';
  this.disputeStatus = 'resolved';
  this.resolvedByAdmin = adminId;
  this.transactionHistory.push({
    action: 'admin-intervention',
    performedBy: adminId,
    details: resolutionDetails
  });
  await this.save();
};

// // Cancel escrow
// EscrowSchema.methods.cancelEscrow = async function (cancelBy) {
//   this.status = 'cancelled';
//   this.transactionHistory.push({
//     action: 'cancelled',
//     performedBy: cancelBy,
//     details: 'Escrow was manually cancelled.'
//   });
//   await this.save();
// };

module.exports = mongoose.model('Escrow', EscrowSchema);
