const mongoose = require('mongoose');

// Localized service categories for Cameroon
const serviceCategories = [
  'Water Supply',
  'House Moving and Transfer Assistant',
  'Package Pickup and Delivery Services',
  'Home Cleaning and Laundry Services',
  'Waste Disposal Services',
  'Transportation',
  'Plumbing Services',
  'Electrical Services',
  'Capentry Services',
  'Pick-up Services'
  
];

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: serviceCategories, required: true }, // Predefined categories
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  hasTransportVehicle: { type: Boolean, default: false }, // Added for House Moving & Transportation services
  isActive: { type: Boolean, default: true },
  minPrice: Number,
  maxPrice: Number,
  isNegotiable: Boolean,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
module.exports.serviceCategories = serviceCategories; // Export categories
