const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// @route   GET api/cart
// @desc    Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
router.post('/', auth, async (req, res) => {
  const { product, configuration, quantity, price } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });
    }
    
    // Simplistic addition (needs logic for matching configurations)
    cart.items.push({ product, configuration, quantity, price });
    cart.totalPrice += (price * quantity);
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
