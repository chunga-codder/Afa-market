const express = require("express");
const {
    approveTransaction,
    rejectTransaction,
} = require("../controllers/transactionController");
const { protect, superAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Super Admin control routes for approving and rejecting transactions
router.post("/approve", [protect, superAdmin], approveTransaction);
router.post("/reject", [protect, superAdmin], rejectTransaction);

module.exports = router;
