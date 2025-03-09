// ✅ Added API routes to deposit & withdraw funds

// routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, releaseEscrow, raiseDispute, resolveDispute } = require('../controllers/walletController');

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.post('/release', releaseEscrow); // ✅ New
router.post('/dispute', raiseDispute);  // ✅ New
router.post('/resolve-dispute', resolveDispute);  // ✅ New

module.exports = router;
