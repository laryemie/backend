// job-skill-backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Request = require('../models/Request');

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/admin/users - Get all users (admin only)
router.get('/users', auth, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/admin/users/:id - Delete a user (admin only)
router.delete('/users/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await user.remove();
    await Worker.deleteMany({ user: req.params.id }); // Delete associated worker profile
    await Request.deleteMany({ client: req.params.id }); // Delete associated requests
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/workers - Get all workers (admin only)
router.get('/workers', auth, adminMiddleware, async (req, res) => {
  try {
    const workers = await Worker.find().populate('user', ['username', 'email']);
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/requests - Get all requests (admin only)
router.get('/requests', auth, adminMiddleware, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('client', ['username', 'email'])
      .populate('typeOfService');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;