// userRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getUserProfile,uploadProfilePhoto, updateUserProfile, changePassword, updateKYC } = require('../controllers/userController');

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

// Routes i should check the get route soon.
 router.get('/profile', [protect], getUserProfile); // Ensure this points to the correct controller function
router.patch('/profile', [protect], updateUserProfile);
router.patch('/password', [protect], changePassword);
router.patch('/kyc', [protect], updateKYC);
router.patch('/profile/photo', [protect], upload.single('profilePhoto'), uploadProfilePhoto);  // Ensure this is correct

module.exports = router;
