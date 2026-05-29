const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const slotRoutes = require('./src/routes/slotRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = require('./src/db');
connectDB();

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
