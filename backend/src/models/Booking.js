const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  slotId: { type: String, required: true },
  slotLabel: { type: String, required: true },
  locId: { type: String, required: true },
  locName: { type: String, required: true },
  locType: { type: String },
  vehicle: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  hours: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
