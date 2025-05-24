const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: 'Anonymous' },
  color: { type: String, default: '#000000' },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
userSchema.statics.findActiveUsers = function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.find({ lastActive: { $gte: oneHourAgo } });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
