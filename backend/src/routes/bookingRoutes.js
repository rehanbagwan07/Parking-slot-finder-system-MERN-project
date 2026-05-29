const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/complete', bookingController.completeBooking);

module.exports = router;
