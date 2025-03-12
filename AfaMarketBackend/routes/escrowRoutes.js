const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrowController'); // Import the controller
const {protect} = require('../middlewares/authMiddleware'); // Import authentication middleware
const {admin} = require('../middlewares/admin')
// 🟢 Create a new escrow and transaction
router.post('/create', [protect], escrowController.createEscrowTransaction);

// 🟢 Release Funds to Seller (Client or Admin triggers)
router.post('/release/:escrowReference', [protect, admin], escrowController.releaseFunds);

// 🟢 Get all escrows (Admin Only)
router.get('/all', [protect, admin], escrowController.getAllEscrows);

// 🟢 Get a specific escrow by escrowReference
router.get('/:escrowReference', [protect], escrowController.getEscrowByReference);

// 🟢 Resolve dispute for an escrow (Admin intervention)
router.post('/resolve-dispute', [protect, admin], escrowController.resolveDispute);

// 🟢 Cancel an escrow (Admin or Authorized User)
router.post('/cancel', [protect, admin], escrowController.cancelEscrow);

module.exports = router;
