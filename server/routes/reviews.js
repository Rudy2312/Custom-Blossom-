const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDBMode } = require('../config/db');
const { mockReviews, mockUsers } = require('../config/mockDbState');
const Review = require('../models/Review');

// @route   POST api/reviews
// @desc    Submit a review
router.post('/', auth, async (req, res) => {
  const { rating, comment, productType } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ msg: 'Please provide rating and comment' });
  }

  try {
    const isMock = getDBMode();
    let newReview;
    let reviewerName = 'Anonymous';

    if (isMock) {
      const user = mockUsers.find(u => u._id === req.user.id);
      if (user) reviewerName = user.name;
      
      const reviewId = 'mock_rev_' + Math.random().toString(36).substring(2, 11);
      newReview = {
        _id: reviewId,
        userId: req.user.id,
        name: reviewerName,
        rating: Number(rating),
        comment,
        productType: productType || 'general',
        createdAt: new Date()
      };
      mockReviews.push(newReview);
    } else {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      if (user) reviewerName = user.name;

      newReview = new Review({
        userId: req.user.id,
        name: reviewerName,
        rating: Number(rating),
        comment,
        productType: productType || 'general'
      });
      await newReview.save();
    }

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews
// @desc    Get all reviews
router.get('/', async (req, res) => {
  try {
    const isMock = getDBMode();
    let reviewsList = [];

    if (isMock) {
      reviewsList = mockReviews;
    } else {
      reviewsList = await Review.find().sort({ createdAt: -1 });
    }

    res.json(reviewsList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
