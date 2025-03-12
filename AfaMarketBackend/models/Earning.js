const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'pending', 'disputed'], default: 'pending' },
});

module.exports = mongoose.model('Earning', EarningSchema);
