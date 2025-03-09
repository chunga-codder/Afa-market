const express = require("express");
const { updateProfile, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
