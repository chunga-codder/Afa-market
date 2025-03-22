const express = require('express');
const router = express.Router();
const {
  createBookingRequest,
  bookNow,
  acceptBooking,
  declineBooking,
  completeBooking,
} = require('../controllers/bookingController');
const {protect} = require('../middlewares/authMiddleware');

// Booking Routes
router.post('/create', [protect], createBookingRequest); // Create Booking Request
router.put('/:bookingId/book-now', [protect], bookNow); // User Sends "Book Now"
router.put('/:bookingId/accept', [protect], acceptBooking); // Agent Confirms Booking
router.put('/:bookingId/decline', [protect], declineBooking); // Agent Declines Booking
router.put('/:bookingId/complete', [protect], completeBooking); // Release Escrow & Complete Booking

module.exports = router;