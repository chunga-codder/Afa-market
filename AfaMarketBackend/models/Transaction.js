
// models/Transaction.js
const mongoose = require('mongoose');

// Define the schema for transactions
const TransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  transactionType: { 
    type: String, 
    enum: ['escrow', 'payment', 'refund'],
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  transactionReference: { 
    type: String, 
    required: true 
  },
  walletBalanceBefore: { 
    type: Number, 
    required: true 
  },
  walletBalanceAfter: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  escrowReference: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);




// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true, // Reference to the user who initiated the transaction
//   },
//   transactionType: {
//     type: String,
//     enum: ['deposit', 'withdraw', 'transfer', 'escrow', 'refund'], // Types of transactions
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'frozen','cancelled'], // Transaction status
//     default: 'pending',
//   },
//   transactionReference: {
//     type: String,
//     unique: true,
//     required: true, // Unique reference for the transaction
//   },
//   mobileMoneyNumber: {
//     type: String,
//     required: false, // Only required for mobile money transactions
//   },
//   walletBalanceBefore: {
//     type: Number,
//     required: true, // Wallet balance before the transaction
//   },
//   walletBalanceAfter: {
//     type: Number,
//     required: true, // Wallet balance after the transaction
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['mobile_money', 'bank_transfer', 'card_payment'], // Payment methods
//     required: true,
//   },
//   description: {
//     type: String,
//     default: '', // Optional description for the transaction
//   },
//   rating: { type: Number, min: 1, max: 5, default: 0 }, // Rating for the service provider (1-5)
//     // Add other fields as necessary, such as transaction dates or payment methods
  
//   createdAt: {
//     type: Date,
//     default: Date.now, // Transaction creation date
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now, // Transaction update date
//   },
//   escrowId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Escrow', // Reference to Escrow (if applicable)
//   },
//   disputeStatus: {
//     type: String,
//     enum: ['none', 'raised', 'resolved'], // If the transaction is disputed
//     default: 'none',
//   },
//   transactionLogs: [
//     {
//       status: {
//         type: String,
//         enum: ['pending', 'completed', 'failed'], // Status updates
//         required: true,
//       },
//       updatedAt: {
//         type: Date,
//         default: Date.now, // Timestamp of the status update
//       },
//       updatedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', // Who changed the status
//       },
//     },
//   ],
// });

// module.exports = mongoose.model('Transaction', transactionSchema);
