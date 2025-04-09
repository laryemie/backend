// routes/chats.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

// Start a chat
router.post('/', auth, async (req, res) => {
  const { workerId } = req.body;
  try {
    let chat = await Chat.findOne({ client: req.user.id, worker: workerId });
    if (!chat) {
      chat = new Chat({ client: req.user.id, worker: workerId, messages: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send a message
router.post('/:chatId/message', auth, async (req, res) => {
  const { message } = req.body;
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });

    chat.messages.push({ sender: req.user.id, message });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get chats for a user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ client: req.user.id }, { worker: req.user.id }],
    })
      .populate('client')
      .populate('worker');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;