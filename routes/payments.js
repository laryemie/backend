// job-skill-backend/routes/payments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (err) {
  console.error('Stripe initialization failed:', err.message);
  stripe = null; // Fallback to avoid runtime errors
}

// POST /api/payments/create-payment-intent - Create a payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ msg: 'Stripe is not initialized' });
  }
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      metadata: { userId: req.user.id },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/payments/history - Get payment history for the user
router.get('/history', auth, async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ msg: 'Stripe is not initialized' });
  }
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 10,
      metadata: { userId: req.user.id },
    });
    res.json(paymentIntents.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;