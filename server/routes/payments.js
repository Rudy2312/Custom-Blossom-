const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');

// @route   POST api/payments/create-order
// @desc    Create a mock Razorpay order
router.post('/create-order', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    // Placeholder for Razorpay API call
    const mockRazorpayOrderId = 'order_' + Math.random().toString(36).substring(2, 11);
    res.json({ orderId: mockRazorpayOrderId, amount: amount * 100, currency: 'INR' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payments/verify
// @desc    Verify mock Razorpay payment
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, amount, orderId } = req.body;
  try {
    // Placeholder for actual signature verification
    const payment = new Payment({
      order: orderId,
      user: req.user.id,
      amount,
      paymentMethod: 'UPI', // mock
      status: 'completed',
      transactionId: razorpay_payment_id
    });
    await payment.save();
    res.json({ success: true, payment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
