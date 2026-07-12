const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productName: String,
      themeName: String,
      detail: String,
      price: Number,
      productIcon: String,
      bg: String,
      product: String,
      mode: String,
      design: mongoose.Schema.Types.Mixed,
      selectedModel: mongoose.Schema.Types.Mixed
    }
  ],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    zip: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'netbanking']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Paid'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Placed', 'Printing', 'Shipped', 'Delivered'],
    default: 'Placed'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
