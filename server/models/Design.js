const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: String,
    required: true,
    enum: ['phone', 'laptop', 'earbuds']
  },
  selectedModel: {
    id: String,
    name: String,
    cameraStyle: String
  },
  design: {
    bgColor: String,
    textSize: Number,
    textColor: String,
    textPosition: String,
    textLayout: String,
    textX: Number,
    textY: Number,
    textRotation: Number,
    pattern: String,
    effect: String,
    photoCount: Number,
    extraColorCount: Number,
    hasHandArt: Boolean,
    manualModel: String,
    text: String,
    fontStyle: String,
    uploadedImage: {
      src: String,
      x: Number,
      y: Number,
      rotate: Number,
      scale: Number
    },
    drawData: String,
    themeId: String,
    designId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Design', DesignSchema);
