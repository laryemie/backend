// job-skill-backend/routes/chats.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const User = require('../models/User');

// POST /api/chats - Create a chat
router.post('/', auth, async (req, res) => {
  const { participantIds } = req.body;
  try {
    const participants = [...new Set([...participantIds, req.user.id])];
    const users = await User.find({ _id: { $in: participants } });
    if (users.length !== participants.length) {
      return res.status(400).json({ msg: 'One or more participants not found' });
    }

    const chat = new Chat({
      participants,
      messages: [],
    });
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/chats - Get all chats for the user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', ['username', 'email']);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/chats/:id - Get a specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', ['username', 'email']);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;