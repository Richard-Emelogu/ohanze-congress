const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  link: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', AdSchema);
