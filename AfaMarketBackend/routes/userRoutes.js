const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');  // Ensure you're using the token verification middleware
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateKYC,
} = require('../controllers/userController');

// Get User Profile
router.get('/profile', verifyToken, getUserProfile);

// Update User Profile
router.patch('/profile', verifyToken, updateUserProfile);

// Change Password
router.patch('/password', verifyToken, changePassword);

// Update KYC Information
router.patch('/kyc', verifyToken, updateKYC);

module.exports = router;
