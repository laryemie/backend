// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  description: { type: String, required: true },
  timeOfExecution: { type: Date, required: true },
  tasks: String,
  proposedPrice: String,
  address: String,
  numberOfWorkers: Number,
  state: { type: Number, default: 1 },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  typeOfPayment: String,
  typeOfService: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeOfService' },
});

module.exports = mongoose.model('Request', requestSchema);