// ✅ Added API routes to deposit & withdraw funds

// routes/walletRoutes.js

const { protect } = require("../middlewares/authMiddleware");const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, releaseEscrow, raiseDispute, resolveDispute } = require('../controllers/walletController');

router.get('/balance', protect, getWalletBalance);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.post('/release', protect, releaseEscrow); // ✅ New
router.post('/dispute', protect, raiseDispute);  // ✅ New
router.post('/resolve-dispute', protect, resolveDispute);  // ✅ New

module.exports = router;
