const express = require("express");
const {
  createNotification,
  markAsRead,
  getNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a new notification (for admin or system events)
router.post("/create", protect, async (req, res) => {
  const { userId, message, type, userPhoneNumber, userEmail } = req.body;
  try {
    const notification = await createNotification(
      userId,
      message,
      type,
      userPhoneNumber,
      userEmail
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to mark a notification as read
router.put("/mark-as-read", protect, async (req, res) => {
  const { notificationId } = req.body;
  try {
    const notification = await markAsRead(notificationId);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get notifications for a user
router.get("/:userId", protect, async (req, res) => {
  try {
    const notifications = await getNotifications(req.params.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
