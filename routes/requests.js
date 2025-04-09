// routes/requests.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/Request');

// Create a request
router.post('/', auth, async (req, res) => {
  const { description, proposedPrice, address, typeOfService } = req.body;
  try {
    const request = new Request({
      description,
      proposedPrice,
      address,
      typeOfService,
      timeOfExecution: new Date(),
      numberOfWorkers: 1,
      client: req.user.id,
    });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all requests with search and filter
router.get('/', auth, async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    let query = {};

    // Search by description
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.proposedPrice = {};
      if (minPrice) query.proposedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.proposedPrice.$lte = parseFloat(maxPrice);
    }

    const requests = await Request.find(query).populate('client').populate('typeOfService');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;