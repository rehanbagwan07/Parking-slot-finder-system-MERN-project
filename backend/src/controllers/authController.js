const User = require('../models/User');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const uid = Math.random().toString(36).slice(2, 10);
    const user = new User({ id: uid, name, email, password, role: role || 'user' });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  registerUser
};
