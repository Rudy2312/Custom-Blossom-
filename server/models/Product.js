const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // 'phone', 'laptop', 'earbuds'
  basePrice: { type: Number, required: true },
  images: [String],
  bestSeller: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
