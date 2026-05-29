const Slot = require('../models/Slot');

const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSlotStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const slot = await Slot.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSlots,
  updateSlotStatus
};
