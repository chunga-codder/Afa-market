const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Referrer ID
    referralEarnings: { type: Number, default: 0 }, // Total referral earnings
    profilePhoto: { type: String, default: '' }, // New field for profile photo
    phone: { type: String }, // Optional phone number
    isAvailable: { type: Boolean, default: true }, // Only show available users
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
    },
    ratings: [{ type: Number }], // Store ratings as an array of numbers
    averageRating: { type: Number, default: 0 }, // Calculate the average rating
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    walletBalance: { type: Number, default: 0 },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
    isFrozen: { type: Boolean, default: false },
    kyc: {
      documentType: {
        type: String,
        enum: ['ID Card', 'Passport', 'Driver License'], // Example document types
        required: false
      },
      documentImage: String,
      selfieImage: String,
      verified: { type: Boolean, default: false },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      
    // New Fields for User Activity Tracking
     last_visited: { type: Date, default: Date.now }, // Tracks the last time the user visited the app
      automaticallyApproved: { type: Boolean, default: false },
    },

    // New Fields for VIP and Earnings Management
    vip_level: { type: Number, required: true, default: 1 },  // 1 = VIP 1, 2 = VIP 2, 3 = VIP 3
    weekly_earnings: { type: Number, default: 0 }, // Total earnings for the current week
    last_reset: { type: Date, default: Date.now }, // The last date earnings were reset
    weekly_earnings_limit: { type: Number, default: 300 }, // Default VIP 1 limit
  },
  
  { timestamps: true }
);

// Set earnings limit based on VIP level
UserSchema.pre('save', function (next) {
  if (this.vip_level === 1) {
    this.weekly_earnings_limit = 300;  // VIP 1 limit
  } else if (this.vip_level === 2) {
    this.weekly_earnings_limit = 700;  // VIP 2 limit
  } else if (this.vip_level === 3) {
    this.weekly_earnings_limit = 1000; // VIP 3 limit
  }
  next();
});

// Virtual to calculate the average rating dynamically
UserSchema.virtual("averageRatingValue").get(function () {
  if (this.ratings.length === 0) return 0;
  const totalRatings = this.ratings.reduce((sum, rating) => sum + rating, 0);
  return totalRatings / this.ratings.length;
});
// Check if user has visited in the current month and update the active status
UserSchema.methods.checkActivity = function () {
  const today = new Date();
  const lastVisitedDate = new Date(this.last_visited);
  
  // Get the start of the current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // If the last visit is before the start of the current month, freeze the account
  if (lastVisitedDate < startOfMonth) {
    this.isFrozen = true; // Freeze account if user hasn't visited this month
  } else {
    this.isFrozen = false; // Keep account active if user visited this month
  }

  // Save the updated status
  return this.save();
};


module.exports = mongoose.model("User", UserSchema);
