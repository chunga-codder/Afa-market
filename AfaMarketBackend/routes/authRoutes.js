const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

// Standard Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Signup with Referral System
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, referrerCode } = req.body;

    // Check if referrer exists
    let referrer = null;
    if (referrerCode) {
      referrer = await User.findOne({ _id: referrerCode });
      if (!referrer) return res.status(400).json({ message: "Invalid referral code" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      referrerId: referrer ? referrer._id : null, // Store referrer ID
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
