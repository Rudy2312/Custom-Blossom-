const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      productType: String,
      modelId: String,
      themeId: String,
      bgColor: String,
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
