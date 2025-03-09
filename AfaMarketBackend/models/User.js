const mongoose = require("mongoose");
const newTransaction = new Transaction({
    userId: userId, // Linking to the correct user
    // other transaction details

    
})

// Define the User Schema
const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        isAvailable: { type: Boolean, default: true }, // Only show available users
        location: {
            type: { type: String, default: "Point" },
            coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
        },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
        walletBalance: { type: Number, default: 0 },
        
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

module.exports = mongoose.model("User", UserSchema);

