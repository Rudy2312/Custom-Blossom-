const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// @route   POST api/coupons/validate
// @desc    Validate a coupon code
router.post('/validate', async (req, res) => {
  const { code, orderValue } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ msg: 'Invalid or expired coupon' });
    
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ msg: 'Coupon has expired' });
    }
    
    if (coupon.minOrderValue > orderValue) {
      return res.status(400).json({ msg: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ msg: 'Coupon usage limit reached' });
    }

    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
