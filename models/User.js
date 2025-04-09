// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'client', 'admin'], required: true },
  address: String,
  enabled: { type: Boolean, default: true },
  longitude: String,
  latitude: String,
  state: { type: Number, default: 1 },
  attempts: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);