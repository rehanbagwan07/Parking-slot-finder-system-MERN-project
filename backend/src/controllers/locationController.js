const Location = require('../models/Location');
const Slot = require('../models/Slot');

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const uid = Math.random().toString(36).slice(2, 10);
    const loc = new Location({ ...req.body, id: uid });
    await loc.save();
    
    // Create slots for the new location
    const total = loc.total;
    const slots = Array.from({length:total},(_,i)=>({
      id:`${loc.id}-${String(i+1).padStart(2,"0")}`,
      locId: loc.id,
      label:`S${String(i+1).padStart(2,"0")}`,
      status: "available",
      bookingId:null,
    }));
    await Slot.insertMany(slots);
    
    res.json(loc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLocations,
  createLocation
};
