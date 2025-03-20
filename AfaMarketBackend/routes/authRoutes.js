const express = require('express');
const { registerUser, loginUser, requestPasswordReset, resetPassword } = require('../controllers/authController');
const User = require('../models/User');
const { check } = require('express-validator');

const router = express.Router();

// Route to request a password reset
// POST /api/auth/request-password-reset
router.post( '/request-password-reset',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  requestPasswordReset
);

// Route to reset the password
// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    check('resetToken', 'Reset token is required').not().isEmpty(),
    check('newPassword', 'Please enter a new password with at least 6 characters').isLength({ min: 6 }),
  ],
  resetPassword
);

// Standard Register & Login Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Signup with Referral System
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, phone, referrerCode } = req.body;

    // Check if referrer exists
    let referrer = null;
    if (referrerCode) {
      referrer = await User.findOne({ _id: referrerCode });
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      referrerId: referrer ? referrer._id : null, // Store referrer ID
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
