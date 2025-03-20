const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto'); // For generating secure tokens
const nodemailer = require('nodemailer'); // For sending emails

// Password reset request (step 1)
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the reset token via email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Change to your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="http://yourfrontendurl.com/reset-password/${resetToken}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email' });
      }
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  } catch (error) {
    console.error('Error in password reset request:', error);
    res.status(500).json({ error: 'Server error during password reset request' });
  }
};

// Password reset (step 2)
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the user by reset token
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and reset the token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

// User registration
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ fullName, email, password: hashedPassword, role });

    // Save user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { registerUser, requestPasswordReset, loginUser, resetPassword}
