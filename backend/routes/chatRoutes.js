const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Send message (with optional file upload)
router.post("/", protect, upload.single("file"), sendMessage);

// Get chat history
router.get("/:receiverId", protect, getChatHistory);

module.exports = router;
