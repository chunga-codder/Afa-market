const express = require('express');
const router = express.Router();
const { getTransactionHistory } = require('../controllers/transactionController');  // Adjust path if needed

// Transaction History Route
router.get('/transaction-history', getTransactionHistory);

module.exports = router;
