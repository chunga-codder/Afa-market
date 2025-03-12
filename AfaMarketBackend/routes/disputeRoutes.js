const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const {protect} = require('../middlewares/authMiddleware');

// Raise a dispute
router.post('/raise', [protect], disputeController.raiseDispute);

// Create a dispute for a transaction
router.post('/create', [protect], disputeController.createDispute);

// Send a message in a dispute
router.post('/message', [protect], disputeController.sendMessage);

// Resolve a dispute (Admin only)
router.post('/resolve', [protect], disputeController.resolveDispute);

// Close a resolved dispute
router.post('/close', [protect], disputeController.closeDispute);

// Get all disputes
router.get('/', [protect], disputeController.getDisputes);

module.exports = router;