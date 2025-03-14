// userRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { updateLastVisited ,updateEarnings, getUserDetails, getUserProfile,uploadProfilePhoto, updateUserProfile, changePassword, updateKYC } = require('../controllers/userController');

const {protect} = require('../middlewares/authMiddleware');



// Set up Multer storage configuration
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
router.post('/update-visit',[protect], updateLastVisited);

// Route to update user earnings (e.g., after a completed service or referral)
router.post('/update-earnings',[protect], updateEarnings);

// Route to get user details including weekly earnings
router.get('/:userId', [protect], getUserDetails);

// Routes i should check the get route soon.
 router.get('/profile', [protect], getUserProfile); // Ensure this points to the correct controller function
router.patch('/profile', [protect], updateUserProfile);
router.patch('/password', [protect], changePassword);
router.patch('/kyc', [protect], updateKYC);
router.patch('/profile/photo', [protect], upload.single('profilePhoto'), uploadProfilePhoto);  // Ensure this is correct

module.exports = router;
