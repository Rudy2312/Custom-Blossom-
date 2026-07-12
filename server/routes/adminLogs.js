const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AdminLog = require('../models/AdminLog');

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
};

// @route   GET api/admin-logs
// @desc    Get all admin logs
router.get('/', [auth, adminOnly], async (req, res) => {
  try {
    const logs = await AdminLog.find().populate('admin', 'name email').sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
