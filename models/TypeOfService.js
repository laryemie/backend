// models/TypeOfService.js
const mongoose = require('mongoose');

const typeOfServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  settings: String,
  state: { type: Number, default: 1 },
});

module.exports = mongoose.model('TypeOfService', typeOfServiceSchema);