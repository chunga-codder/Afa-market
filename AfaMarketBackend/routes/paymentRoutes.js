const express = require('express');
const { handleFlutterwaveWebhook } = require('../controllers/flutterwaveController');
const router = express.Router();

// Route to handle Flutterwave payment updates
router.post('/flutterwave-webhook', handleFlutterwaveWebhook);

module.exports = router;
