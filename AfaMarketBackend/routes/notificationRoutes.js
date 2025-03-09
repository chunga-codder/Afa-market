const express = require("express");
const { getUserNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get user notifications
router.get("/", protect, getUserNotifications);

// Mark notifications as read
router.put("/read", protect, markAsRead);

module.exports = router;
