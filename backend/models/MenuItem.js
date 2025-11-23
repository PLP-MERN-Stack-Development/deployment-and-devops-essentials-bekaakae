const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    enum: ['burgers', 'pizza', 'sides', 'drinks', 'desserts']
  },
  image: { 
    type: String, 
    required: true 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  preparationTime: { 
    type: Number, 
    default: 15,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);