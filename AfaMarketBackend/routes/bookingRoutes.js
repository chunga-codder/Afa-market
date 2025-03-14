const express = require('express');
const router = express.Router();
const  {protect}  = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');

// 🟢 Create a Booking Request (User clicks "Book Now")
router.post('/book-service', [protect], bookingController.createBookingRequest);

// 🟢 Agent Accepts the Booking (Triggers Escrow Creation)
router.post('/accept-booking/:bookingId', [protect], bookingController.acceptBooking);

// 🟢 Agent Declines the Booking
router.post('/decline-booking/:bookingId', [protect], bookingController.declineBooking);

module.exports = router;




// Booking Model → Stores details about a service request before payment is processed.
// Escrow Model → Holds funds once a booking is accepted to ensure safe payment.
// Transaction Model → Records financial transactions, including escrow deposits and releases.
