const express = require('express');
const { getServiceCategories, createService, getServices, getServiceById, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/categories', getServiceCategories); // Get predefined service categories
router.post('/create', protect, createService); // Create a new service
router.get('/', getServices); // Get all active services
router.get('/:id', getServiceById); // Get a specific service
router.put('/:id', protect, updateService); // Update service (only provider)
router.delete('/:id', protect, deleteService); // Delete service (only provider)

module.exports = router;


// Next Steps
// Frontend:

// When users select House Moving or Transportation, prompt them to specify whether they have a transport vehicle or not.
// Implement a dropdown to select service category from the predefined list.
// API Connection:

// Fetch the categories from /api/services/categories and populate the category selection dropdown.
