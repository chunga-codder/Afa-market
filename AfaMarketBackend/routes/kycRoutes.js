const express = require("express");
const { uploadIDCard } = require("../controllers/kycController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect route with authentication middleware
router.post("/upload", protect, uploadIDCard);

module.exports = router;
