const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// CREATE NEW ORDER
router.post('/', async (req, res) => {
  try {
    console.log('=== ORDER CREATION STARTED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { items, customer, totalAmount } = req.body;

    // Manual validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }
    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'All customer information is required' });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required' });
    }

    // Generate order data
    const orderData = {
      orderNumber: generateOrderNumber(),
      items: items.map(item => ({
        menuItem: item.menuItem,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim()
      },
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    };

    console.log('Order data to save:', JSON.stringify(orderData, null, 2));

    // Create and save order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('=== ORDER CREATION SUCCESSFUL ===');
    console.log('Saved order ID:', savedOrder._id);
    console.log('Order number:', savedOrder.orderNumber);

    res.status(201).json(savedOrder);

  } catch (error) {
    console.log('=== ORDER CREATION FAILED ===');
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
});

// GET ORDER BY ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
});

// UPDATE ORDER STATUS
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      message: 'Error updating order', 
      error: error.message 
    });
  }
});

module.exports = router;