const mongoose = require('mongoose');

// Simple order item schema
const orderItemSchema = new mongoose.Schema({
  menuItem: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  price: Number
});

// Main order schema - NO required fields except what we manually validate
const orderSchema = new mongoose.Schema({
  orderNumber: String,
  items: [orderItemSchema],
  totalAmount: Number,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  status: {
    type: String,
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  estimatedDelivery: Date
}, {
  timestamps: true
});

// Remove all validation and pre-save hooks
// We'll handle validation in the route

module.exports = mongoose.model('Order', orderSchema);