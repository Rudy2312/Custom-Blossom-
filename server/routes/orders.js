const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDBMode } = require('../config/db');
const { mockOrders } = require('../config/mockDbState');
const Order = require('../models/Order');

// @route   POST api/orders
// @desc    Place a new order
router.post('/', auth, async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0 || !shippingAddress || !paymentMethod || !totalAmount) {
    return res.status(400).json({ msg: 'Please provide all checkout details' });
  }

  try {
    const isMock = getDBMode();
    let newOrder;

    if (isMock) {
      const orderId = 'mock_ord_' + Math.random().toString(36).substring(2, 11);
      newOrder = {
        _id: orderId,
        userId: req.user.id,
        items,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'Paid',
        orderStatus: 'Placed',
        totalAmount,
        createdAt: new Date()
      };
      mockOrders.push(newOrder);
    } else {
      newOrder = new Order({
        userId: req.user.id,
        items,
        shippingAddress,
        paymentMethod,
        totalAmount
      });
      await newOrder.save();
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders
// @desc    Get user orders history
router.get('/', auth, async (req, res) => {
  try {
    const isMock = getDBMode();
    let userOrders = [];

    if (isMock) {
      userOrders = mockOrders.filter(o => o.userId === req.user.id);
    } else {
      userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/admin
// @desc    Get all orders (Admin only)
router.get('/admin', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied, admin resource' });
  }

  try {
    const isMock = getDBMode();
    let allOrders = [];

    if (isMock) {
      allOrders = mockOrders;
    } else {
      allOrders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    }

    res.json(allOrders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;

  if (!status || !['Placed', 'Printing', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ msg: 'Please provide a valid status: Placed, Printing, Shipped, Delivered' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied, admin resource' });
  }

  try {
    const isMock = getDBMode();
    let updatedOrder = null;

    if (isMock) {
      const idx = mockOrders.findIndex(o => o._id === req.params.id);
      if (idx > -1) {
        mockOrders[idx].orderStatus = status;
        updatedOrder = mockOrders[idx];
      }
    } else {
      updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { orderStatus: status },
        { new: true }
      );
    }

    if (!updatedOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
