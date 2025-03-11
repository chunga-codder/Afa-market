const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  satisfactionScore: { type: Number, default: 0 },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
