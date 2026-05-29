const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  locId: { type: String, required: true },
  label: { type: String, required: true },
  status: { type: String, enum: ['available', 'reserved', 'occupied'], default: 'available' },
  bookingId: { type: String, default: null }
});

module.exports = mongoose.model('Slot', slotSchema);
