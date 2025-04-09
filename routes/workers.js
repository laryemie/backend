// routes/workers.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Worker = require('../models/Worker');
const User = require('../models/User');

// Create a worker profile
router.post('/', auth, async (req, res) => {
  const { skills, qualifications, experience } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'worker') return res.status(403).json({ msg: 'Access denied' });

    const worker = new Worker({
      user: req.user.id,
      skills: skills.map(s => ({ title: s.title, level: s.level, description: s.description, state: 1 })),
      qualifications: qualifications.map(q => ({
        title: q.title,
        country: q.country,
        center: q.center,
        startdate: q.startdate,
        enddate: q.enddate,
        description: q.description,
        state: 1,
      })),
      experience: experience.map(e => ({
        position: e.position,
        company: e.company,
        startdate: e.startdate,
        enddate: e.enddate,
        tasks: e.tasks,
        state: 1,
      })),
    });
    await worker.save();
    res.json(worker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get worker profile
router.get('/me', auth, async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id }).populate('user');
    if (!worker) return res.status(404).json({ msg: 'Worker profile not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all workers with search and filter
router.get('/', auth, async (req, res) => {
  try {
    const { search, skill } = req.query;
    let query = {};

    // Search by username
    if (search) {
      const users = await User.find({
        username: { $regex: search, $options: 'i' },
        role: 'worker',
      });
      const userIds = users.map(user => user._id);
      query.user = { $in: userIds };
    }

    // Filter by skill
    if (skill) {
      query['skills.title'] = { $regex: skill, $options: 'i' };
    }

    const workers = await Worker.find(query).populate('user');
    res.json(workers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;