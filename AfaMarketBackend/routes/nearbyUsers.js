const express = require('express');
const router = express.Router();
const { searchNearbyUsers } = require('../controllers/nearbyUsersController'); // Make sure this path is correct

// Route for searching nearby users based on location and service type
router.post('/', searchNearbyUsers);

module.exports = router;
