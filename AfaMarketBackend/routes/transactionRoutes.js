const express = require("express");
const {
    depositFunds,
    withdrawFunds,
    transferFunds,
    createEscrow,
    completeEscrow,
} = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.post("/deposit", protect, depositFunds);
router.post("/withdraw", protect, withdrawFunds);
router.post("/transfer", protect, transferFunds);
router.post("/escrow", protect, createEscrow);
router.post("/escrow/complete", protect, completeEscrow);
// Route to create a new transaction
router.post('/create', protect, createTransaction);
// Rate a service provider after the transaction
router.post('/rate', protect, rateTransaction);

module.exports = router;
