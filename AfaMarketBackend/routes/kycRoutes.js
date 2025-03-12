const express = require('express');
const { uploadIDCard, submitKYC, approveKYC, autoApproveKYC } = require('../controllers/kycController');
const { protect, authorizeAdmin } = require('../middlewares/authMiddleware'); // Ensure these middleware functions exist

const router = express.Router();

// 🟢 Upload ID Card for KYC
router.post('/upload-id', [protect], uploadIDCard);

// 🟢 Submit KYC Documents
router.post('/submit', [protect], submitKYC);

// 🟢 Admin Approves KYC
router.post('/approve', [protect, authorizeAdmin], approveKYC);

// 🟢 Auto KYC Approval via Third-Party Service
router.post('/auto-approve', [protect], autoApproveKYC);

module.exports = router;

