// models/Escrow.js
const mongoose = require('mongoose');

// Define the schema for the escrow system
const EscrowSchema = new mongoose.Schema({
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the buyer (User model)
    required: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the seller (User model)
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'released', 'disputed', 'resolved', 'cancelled'], 
    default: 'pending' // Escrow status (pending, released, disputed, etc.)
  },
  escrowReference: { 
    type: String, 
    required: true
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
      default: '' // Additional details about the action
    }
  }],
});

module.exports = mongoose.model('Escrow', EscrowSchema);






// const Transaction = require('../models/Transaction'); // Adjust path based on directory structure
// // escrow system setup bellow
// const mongoose = require('mongoose');


// // Define the schema for the escrow system
// const EscrowSchema = new mongoose.Schema({
//   buyerId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', // Reference to the buyer (User model)
//     required: true 
//   },
//   sellerId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', // Reference to the seller (User model)
//     required: true 
//   },
//   amount: { 
//     type: Number, 
//     required: true 
//   },
//   status: { 
//     type: String, 
//     enum: ['pending', 'released', 'disputed', 'resolved', 'cancelled'], 
//     default: 'pending' // Escrow status (pending, released, disputed, etc.)
//   },
//   disputeReason: { 
//     type: String, 
//     default: '' // Reason for dispute, if applicable
//   },
//   disputeStatus: { 
//     type: String, 
//     enum: ['open', 'resolved', 'closed'], 
//     default: 'open' // Dispute status (open, resolved, or closed)
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now // Timestamp when the escrow was created
//   },
//   resolvedByAdmin: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     default: null // Reference to the admin who resolved the dispute, if applicable
//   },
//   autoReleaseEnabled: { 
//     type: Boolean, 
//     default: false // Flag to indicate if automatic release is enabled
//   },
//   releaseTime: { 
//     type: Date, 
//     default: null // Time when the funds will automatically be released
//   },
//   transactionHistory: [{ 
//     action: { 
//       type: String, 
//       enum: ['created', 'released', 'disputed', 'resolved', 'admin-intervention', 'cancelled'], 
//       required: true
//     },
//     timestamp: { 
//       type: Date, 
//       default: Date.now
//     },
//     performedBy: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: 'User', 
//       required: true
//     },
//     details: { 
//       type: String, 
//       default: '' // Additional details about the action
//     }
//   }],
// });

// // Add methods to handle automatic fund release and dispute resolution

// // Automatic fund release (after a set time or manual trigger)
// EscrowSchema.methods.releaseFunds = async function() {
//   const currentTime = new Date();
  
//   // Check if automatic release is enabled and the release time has passed
//   if (this.autoReleaseEnabled && this.releaseTime <= currentTime) {
//     this.status = 'released'; // Change status to released
//     this.transactionHistory.push({
//       action: 'released',
//       performedBy: this.buyer, // In case the buyer triggered the release
//       details: 'Automatic fund release triggered.',
//     });
//     await this.save(); // Save the escrow document after updating the status
//   }
// };

// // Resolve dispute (manual intervention by admin)
// EscrowSchema.methods.resolveDispute = async function(adminId, resolutionDetails) {
//   this.status = 'resolved'; // Change status to resolved
//   this.disputeStatus = 'resolved'; // Mark dispute as resolved
//   this.resolvedByAdmin = adminId; // Save the admin who resolved it
  
//   // Add a new transaction history entry
//   this.transactionHistory.push({
//     action: 'admin-intervention',
//     performedBy: adminId,
//     details: resolutionDetails,
//   });

//   await this.save(); // Save the escrow document after resolving dispute
// };

// // Method to cancel escrow (manual cancellation)
// EscrowSchema.methods.cancelEscrow = async function() {
//   this.status = 'cancelled'; // Change status to cancelled
//   this.transactionHistory.push({
//     action: 'cancelled',
//     performedBy: this.buyer, // Assuming the buyer cancels; could be seller or admin as well
//     details: 'Escrow was manually cancelled.',
//   });

//   await this.save(); // Save the escrow document after cancellation
// };

// module.exports = mongoose.model('Escrow', EscrowSchema);

