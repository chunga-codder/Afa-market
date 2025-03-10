const express = require("express");
const {
  approveTransaction,
  rejectTransaction,
} = require("../controllers/transactionController");
const {
  assignAdminToDispute,
  getActivityLogs,
  viewAllChats,
  listAllAdmins,
} = require("../controllers/superAdminController");
const { protect, superAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Super Admin control routes for approving and rejecting transactions
router.post("/approve", [protect, superAdmin], approveTransaction);
router.post("/reject", [protect, superAdmin], rejectTransaction);

// Super Admin routes for dispute management and admin oversight
router.post('/assign-admin-to-dispute/:disputeId', protect, assignAdminToDispute);
router.get('/activity-logs', protect, getActivityLogs);
router.get('/view-chats', protect, viewAllChats);
router.get('/admins', protect, listAllAdmins);

module.exports = router;