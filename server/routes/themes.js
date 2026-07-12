const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');

// @route   GET api/themes
// @desc    Get all themes
router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
