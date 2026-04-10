const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register (pending approval)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword, role: role || 'admin', status: 'pending' });
    await user.save();
    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login (only approved users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
    if (user.status !== 'approved') return res.status(403).json({ message: 'Your account is pending approval.' });
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/pending', auth, async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.patch('/approve/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `${user.name} has been approved.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.patch('/reject/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `${user.name} has been rejected.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;