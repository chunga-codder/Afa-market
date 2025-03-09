const express = require('express');
const router = express.Router();
const {
  createEscrow,
  releaseFunds,
  createDispute,
  resolveDispute,
  getEscrows
} = require('../controllers/escrowController');

// 🟢 Create a new escrow transaction (Buyer makes payment)
router.post('/create', createEscrow);

// 🟢 Release funds to seller (Admin or Client triggers)
router.put('/release/:escrowId', async (req, res) => {
  try {
    const { escrowId } = req.params;

    // Ensure a valid MongoDB ObjectId format
    if (!escrowId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid escrow ID' });
    }

    const result = await releaseFunds(escrowId);
    res.json({ message: 'Funds released successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Create a dispute (Buyer reports issue)
router.post('/dispute', createDispute);

// 🟢 Resolve a dispute (Admin decision)
router.put('/dispute/resolve', resolveDispute);

// 🟢 Get all escrow transactions (For Admin)
router.get('/', getEscrows);

module.exports = router;


