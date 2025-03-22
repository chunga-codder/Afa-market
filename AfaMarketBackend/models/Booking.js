const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  initialAmount: { type: Number, required: true }, // Initial price before negotiation
  negotiatedAmount: { type: Number }, // Final agreed price after negotiation
  status: {
    type: String,
    enum: [
      'negotiation', 
      'awaiting_agent_confirmation', 
      'confirmed', 
      'completed', 
      'declined'
    ],
    default: 'negotiation', // Default to negotiation stage
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
