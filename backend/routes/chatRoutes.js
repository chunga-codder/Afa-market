const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Send a message
router.post("/", protect, sendMessage);

// Get chat history
router.get("/:receiverId", protect, getChatHistory);

module.exports = router;
