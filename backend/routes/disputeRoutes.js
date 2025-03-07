const express = require("express");
const {
    raiseDispute,
    resolveDispute,
    closeDispute,
} = require("../controllers/disputeController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.post("/raise", protect, raiseDispute);
router.post("/resolve", [protect, admin], resolveDispute);
router.post("/close", [protect, admin], closeDispute);

module.exports = router;
