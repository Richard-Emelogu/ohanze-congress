const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  items: {
    type: Array,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  shippingAddress: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);