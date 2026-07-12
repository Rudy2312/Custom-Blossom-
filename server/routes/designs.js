const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDBMode } = require('../config/db');
const { mockDesigns } = require('../config/mockDbState');
const Design = require('../models/Design');

// @route   POST api/designs
// @desc    Save a design
router.post('/', auth, async (req, res) => {
  const { product, selectedModel, design } = req.body;

  if (!product || !design) {
    return res.status(400).json({ msg: 'Please provide design configurations' });
  }

  try {
    const isMock = getDBMode();
    let savedDesign;

    if (isMock) {
      const designId = 'mock_dsgn_' + Math.random().toString(36).substring(2, 11);
      savedDesign = {
        _id: designId,
        userId: req.user.id,
        product,
        selectedModel,
        design,
        createdAt: new Date()
      };
      mockDesigns.push(savedDesign);
    } else {
      savedDesign = new Design({
        userId: req.user.id,
        product,
        selectedModel,
        design
      });
      await savedDesign.save();
    }

    res.status(201).json({ success: true, design: savedDesign });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/designs
// @desc    Get user saved designs
router.get('/', auth, async (req, res) => {
  try {
    const isMock = getDBMode();
    let userDesigns = [];

    if (isMock) {
      userDesigns = mockDesigns.filter(d => d.userId === req.user.id);
    } else {
      userDesigns = await Design.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(userDesigns);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/designs/:id
// @desc    Delete a design
router.delete('/:id', auth, async (req, res) => {
  try {
    const isMock = getDBMode();
    let success = false;

    if (isMock) {
      const idx = mockDesigns.findIndex(d => d._id === req.params.id && d.userId === req.user.id);
      if (idx > -1) {
        mockDesigns.splice(idx, 1);
        success = true;
      }
    } else {
      const design = await Design.findOne({ _id: req.params.id, userId: req.user.id });
      if (design) {
        await Design.deleteOne({ _id: req.params.id });
        success = true;
      }
    }

    if (!success) {
      return res.status(404).json({ msg: 'Design not found or unauthorized' });
    }

    res.json({ success: true, msg: 'Design deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
