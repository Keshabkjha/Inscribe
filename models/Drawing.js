const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: { type: String, required: true },
  size: { type: Number, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Index for faster querying by timestamp
drawingSchema.index({ timestamp: 1 });

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;
