const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings, getBookingByTicket } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/ticket/:ticketId', protect, getBookingByTicket);
router.get('/', protect, authorize('admin', 'organizer'), getAllBookings);

module.exports = router;
