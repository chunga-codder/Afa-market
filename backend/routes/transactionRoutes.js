const express = require("express");
const {
    depositFunds,
    withdrawFunds,
    transferFunds,
    createEscrow,
    completeEscrow,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.post("/deposit", protect, depositFunds);
router.post("/withdraw", protect, withdrawFunds);
router.post("/transfer", protect, transferFunds);
router.post("/escrow", protect, createEscrow);
router.post("/escrow/complete", protect, completeEscrow);

module.exports = router;
