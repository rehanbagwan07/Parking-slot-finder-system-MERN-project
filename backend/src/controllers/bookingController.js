const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const b = req.body;
    const booking = new Booking({
      ...b,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date()
    });
    await booking.save();
    
    // Update slot status
    await Slot.findOneAndUpdate(
      { id: b.slotId },
      { status: 'reserved', bookingId: booking.id }
    );
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Not found' });
    
    // Free the slot
    await Slot.findOneAndUpdate(
      { id: booking.slotId },
      { status: 'available', bookingId: null }
    );
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { status: 'completed' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Not found' });
    
    // Free the slot
    await Slot.findOneAndUpdate(
      { id: booking.slotId },
      { status: 'available', bookingId: null }
    );
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking,
  completeBooking
};
