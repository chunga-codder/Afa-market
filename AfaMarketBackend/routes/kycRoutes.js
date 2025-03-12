const express = require("express");
const router = express.Router();
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware");
const {
  uploadIDCard,
  submitKYC,
  getKYCStatus,
  approveKYC,
  rejectKYC,
  autoApproveKYC,
  getPendingKYCs,
  updateKYC,
} = require("../controllers/kycController");



// Update KYC information
router.put("/update", [protect], updateKYC);

// 🟢 Upload ID Card for KYC
router.post("/upload-id", [protect], uploadIDCard);

// 🟢 Submit KYC Documents
router.post("/submit", [protect], submitKYC);

// 🟢 Get User KYC Status
router.get("/status", [protect], getKYCStatus);

// 🟢 Admin Approves KYC
router.post("/approve", [protect, authorizeAdmin], approveKYC);

// 🟢 Admin Rejects KYC
router.post("/reject", [protect, authorizeAdmin], rejectKYC);

// 🟢 Auto KYC Approval via Third-Party Service
router.post("/auto-approve", [protect], autoApproveKYC);

// 🟢 Get All Pending KYC Requests (Admin)
router.get("/pending", [protect, authorizeAdmin], getPendingKYCs);

module.exports = router;


// How to Use These APIs
// API Endpoint	Method	Description	Access
// /upload-id	POST	Upload ID card for KYC	User
// /submit	POST	Submit KYC documents (ID + selfie)	User
// /status	GET	Get KYC status	User
// /approve	POST	Admin approves KYC	Admin
// /reject	POST	Admin rejects KYC	Admin
// /auto-approve	POST	Auto verify KYC via API	User
// /pending	GET	Get all pending KYC requests	Admin
