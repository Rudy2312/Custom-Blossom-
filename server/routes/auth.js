const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { getDBMode } = require('../config/db');
const { mockUsers } = require('../config/mockDbState');
const User = require('../models/User');

// Helper to sign JWT
const signToken = (userId, role) => {
  const payload = {
    user: { id: userId, role }
  };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'supersecretjwtkeyforcustomblossom2026!',
    { expiresIn: '30d' }
  );
};

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const isMock = getDBMode();
    let emailExists = false;

    if (isMock) {
      emailExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      const user = await User.findOne({ email });
      if (user) emailExists = true;
    }

    if (emailExists) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (isMock) {
      const mockId = 'mock_usr_' + Math.random().toString(36).substring(2, 11);
      newUser = {
        _id: mockId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        isPremium: false,
        wishlist: [],
        createdAt: new Date()
      };
      mockUsers.push(newUser);
    } else {
      newUser = new User({
        name,
        email,
        password: hashedPassword
      });
      await newUser.save();
    }

    const token = signToken(newUser._id, newUser.role);
    res.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isPremium: newUser.isPremium,
        wishlist: newUser.wishlist
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const isMock = getDBMode();
    let user;

    if (isMock) {
      user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = signToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        wishlist: user.wishlist
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const isMock = getDBMode();
    let user;

    if (isMock) {
      user = mockUsers.find(u => u._id === req.user.id);
    } else {
      user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      wishlist: user.wishlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/premium
// @desc    Upgrade user to premium
router.post('/premium', auth, async (req, res) => {
  try {
    const isMock = getDBMode();
    
    if (isMock) {
      const idx = mockUsers.findIndex(u => u._id === req.user.id);
      if (idx !== -1) {
        mockUsers[idx].isPremium = true;
      }
    } else {
      await User.findByIdAndUpdate(req.user.id, { isPremium: true });
    }
    
    res.json({ success: true, msg: 'Upgraded to Premium!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/wishlist
// @desc    Toggle wishlist item
router.post('/wishlist', auth, async (req, res) => {
  const { productType, modelId, themeId, bgColor } = req.body;
  
  try {
    const isMock = getDBMode();
    let updatedWishlist = [];

    if (isMock) {
      const user = mockUsers.find(u => u._id === req.user.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
      
      const itemIdx = user.wishlist.findIndex(
        item => item.productType === productType && item.themeId === themeId && item.bgColor === bgColor
      );

      if (itemIdx > -1) {
        user.wishlist.splice(itemIdx, 1);
      } else {
        user.wishlist.push({ productType, modelId, themeId, bgColor });
      }
      updatedWishlist = user.wishlist;
    } else {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
      
      const itemIdx = user.wishlist.findIndex(
        item => item.productType === productType && item.themeId === themeId && item.bgColor === bgColor
      );

      if (itemIdx > -1) {
        user.wishlist.splice(itemIdx, 1);
      } else {
        user.wishlist.push({ productType, modelId, themeId, bgColor });
      }
      await user.save();
      updatedWishlist = user.wishlist;
    }
    
    res.json({ success: true, wishlist: updatedWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/users
// @desc    Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    const isMock = getDBMode();
    let usersList = [];

    if (isMock) {
      usersList = mockUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isPremium: u.isPremium
      }));
    } else {
      usersList = await User.find().select('-password');
    }

    res.json({ users: usersList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
