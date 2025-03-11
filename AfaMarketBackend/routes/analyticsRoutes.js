const { protect } = require("../middleware/authMiddleware");
const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', protect, getAnalytics);

module.exports = router;
