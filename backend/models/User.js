const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        isVerified: { type: Boolean, default: false },
        kycVerified: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
        walletBalance: { type: Number, default: 0 },
        idCardImage: { type: String }, // Store the ID card image path
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
