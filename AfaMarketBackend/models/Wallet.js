//wallet system setup
// ✅ What This Fixes
// ✔ Flutterwave Compatibility: Adds a transaction reference.
// ✔ Mobile Money Support: Works with MTN & Orange.
// ✔ In-App Transfers: Users can send money to others.
// ✔ Multi-Currency Ready: Supports XAF by default.

const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'XAF' }, // ✅ Supports Cameroon currency
      mobileMoneyNumber: { type: String }, // ✅ For MoMo transactions
      transactionReference: { type: String, required: true }, // ✅ Required for Flutterwave tracking
      recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ For in-app transfers
      status: { type: String, enum: ['pending', 'completed', 'failed', 'escrow', 'disputed'], default: 'pending' }, // ✅ Added escrow & dispute tracking
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

// ✅ Ensure Unique Transaction References
WalletSchema.index({ 'transactions.transactionReference': 1 }, { unique: true });

module.exports = mongoose.model('Wallet', WalletSchema);

