// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
  state: { type: Number, default: 1 },
});

module.exports = mongoose.model('Chat', chatSchema);