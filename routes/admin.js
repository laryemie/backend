// job-skill-backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Request = require('../models/Request');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all requests (jobs)
router.get('/jobs', auth, isAdmin, async (req, res) => {
  try {
    const requests = await Request.find().populate('client');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a job
router.delete('/jobs/:id', auth, isAdmin, async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark a user as fraudulent
router.put('/users/:id/fraud', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.enabled = false;
    await user.save();
    res.json({ msg: 'User marked as fraudulent' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;