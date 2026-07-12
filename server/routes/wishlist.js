const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');

// @route   GET api/wishlist
// @desc    Get current user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = { items: [] };
    }
    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wishlist
// @desc    Toggle item in wishlist
router.post('/', auth, async (req, res) => {
  const { productType, modelId, themeId, bgColor } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }
    
    const itemIndex = wishlist.items.findIndex(
      item => item.productType === productType && item.themeId === themeId && item.bgColor === bgColor
    );

    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1); // Remove
    } else {
      wishlist.items.push({ productType, modelId, themeId, bgColor }); // Add
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
