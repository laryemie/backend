// models/Worker.js
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ title: String, level: String, description: String, state: Number }],
  qualifications: [
    {
      title: String,
      country: String,
      center: String,
      startdate: Date,
      enddate: Date,
      description: String,
      state: Number,
    },
  ],
  experience: [
    {
      position: String,
      company: String,
      startdate: Date,
      enddate: Date,
      tasks: String,
      state: Number,
    },
  ],
});

module.exports = mongoose.model('Worker', workerSchema);