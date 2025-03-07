const express = require("express");
const { depositFunds, withdrawFunds, transferFunds } = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect wallet routes with authentication middleware
router.post("/deposit", protect, depositFunds);
router.post("/withdraw", protect, withdrawFunds);
router.post("/transfer", protect, transferFunds);

module.exports = router;
