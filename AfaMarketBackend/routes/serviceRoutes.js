const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have a middleware to protect routes
const {
  
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getServiceCategories,
  
} = require('../controllers/serviceController');

// Get predefined service categories (no authentication needed for this one)
// router.get('/categories', [protect], getServiceCategories);

// Create a new service (protected route, provider only)
router.post('/create', [protect], createService);

// Get all active services (no authentication needed for this one)
router.get('/', [protect], getServices);

// Get a specific service by ID (no authentication needed for this one)
router.get('/:id',[protect], getServiceById);

// Update an existing service (protected route, provider only)
router.put('/:id', [protect], updateService);

// Delete a service (protected route, provider only)
router.delete('/:id', [protect], deleteService);

// Endpoint to get service categories (protected)
router.get('/categories', [protect], (req, res) => {
  res.json({ categories: getServiceCategories });
});

module.exports = router;
