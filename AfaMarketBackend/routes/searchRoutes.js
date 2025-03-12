const express = require("express");
const { searchNearbyUsers } = require("../controllers/searchController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Search for nearby service providers
router.post("/", protect, searchNearbyUsers);

module.exports = router;
