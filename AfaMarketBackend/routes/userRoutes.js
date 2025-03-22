const express = require('express');
const multer = require('multer');
const router = express.Router();
const { updateLastVisited, updateEarnings,updateAvailability, getUserDetails, getUserProfile, uploadProfilePhoto, updateUserProfile, changePassword, updateKYC } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Set up Multer storage configuration for profile photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to update last visit and check activity
router.post('/update-visit', [protect], updateLastVisited);

// Route to update user earnings (e.g., after a completed service or referral)
router.post('/update-earnings', [protect], updateEarnings);

// Route to get user details including weekly earnings
router.get('/:userId', [protect], getUserDetails);

// Route to get user profile
router.get('/profile', [protect], getUserProfile);

// Route to update user profile
router.patch('/profile', [protect], updateUserProfile);

// Route to change password
router.patch('/password', [protect], changePassword);

// Route to update KYC (Know Your Customer)
router.patch('/kyc', [protect], updateKYC);

// Route to upload profile photo
router.patch('/profile/photo', [protect], upload.single('profilePhoto'), uploadProfilePhoto);

// Route for updating availability (assumed to be for the service provider)
router.patch('/update-availability', [protect], updateAvailability);

module.exports = router;
