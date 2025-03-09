const express = require("express");
const { sendMessage, getChatHistory,markAsRead } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Send message (with optional file upload)
router.post("/", protect, upload.single("file"), sendMessage);

// Get chat history
router.get('/chat-history/:userId/:recipientId', protect, getChatHistory);
// Route to mark messages as read
router.put('/mark-as-read', protect, markAsRead); 

module.exports = router;
