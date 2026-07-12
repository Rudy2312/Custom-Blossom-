const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'UPDATE_PRODUCT'
  target: { type: String }, // e.g., 'Product ID'
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
