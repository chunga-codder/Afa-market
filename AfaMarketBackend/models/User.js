const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    profilePhoto: { type: String, default: '' }, // New field for profile photophone: { type: String, required: true, unique: true },
    isAvailable: { type: Boolean, default: true }, // Only show available users
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
    },
    ratings: [{ type: Number }],  // Store ratings as an array of numbers
    averageRating: { type: Number, default: 0 }, // Calculate the average rating
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    walletBalance: { type: Number, default: 0 },
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
      automaticallyApproved: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Virtual to calculate the average rating dynamically
UserSchema.virtual("averageRatingValue").get(function () {
  if (this.ratings.length === 0) return 0;
  const totalRatings = this.ratings.reduce((sum, rating) => sum + rating, 0);
  return totalRatings / this.ratings.length;
});

module.exports = mongoose.model("User", UserSchema);
