const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middlewares/authMiddleware'); // Assuming protect is middleware for authentication
const {
    createTransaction,
    rateTransaction,
    depositFunds,
    withdrawFunds,
    transferFunds,
    createEscrow,
    completeEscrow,
    approveTransaction,
    rejectTransaction,
    getTransactionHistory
} = require('../controllers/transactionController');

// Create a transaction
router.post('/create', protect, async (req, res) => {
    const { userId, transactionType, amount, recipientId, escrowId, status } = req.body;
    try {
        const transaction = await createTransaction(userId, transactionType, amount, recipientId, escrowId, status);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
});

// Rate a service provider
router.post('/rate', [protect], rateTransaction);

// Deposit funds
router.post('/deposit', [protect], depositFunds);

// Withdraw funds
router.post('/withdraw', [protect], withdrawFunds);

// Transfer funds
router.post('/transfer', [protect], transferFunds);

// Create an escrow
router.post('/escrow', [protect], createEscrow);

// Complete an escrow (release funds)
router.post('/complete-escrow', [protect], completeEscrow);

// Approve a transaction (Super Admin Control)
router.post('/approve', [protect, authorizeAdmin], approveTransaction);

// Reject a transaction (Super Admin Control)
router.post('/reject', [protect, authorizeAdmin], rejectTransaction);

// Get transaction history for a user
router.get('/history', [protect], getTransactionHistory);

module.exports = router;
