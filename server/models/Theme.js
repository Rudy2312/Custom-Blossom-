const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  thumbnail: { type: String },
  config: { type: Object }, // Store detailed theme configurations, layers, colors
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Theme', ThemeSchema);
