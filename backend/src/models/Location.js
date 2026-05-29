const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  type: { type: String, required: true },
  total: { type: Number, required: true },
  price: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  mx: { type: Number },
  my: { type: Number },
  color: { type: String },
  note: { type: String }
});

module.exports = mongoose.model('Location', locationSchema);
