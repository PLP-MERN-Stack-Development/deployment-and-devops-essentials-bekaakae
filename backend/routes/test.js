const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// DEVELOPMENT ONLY - Auto-progress orders for testing
router.post('/progress-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
    
    for (const order of orders) {
      const currentIndex = statusFlow.indexOf(order.status);
      if (currentIndex < statusFlow.length - 1) {
        const nextStatus = statusFlow[currentIndex + 1];
        await Order.findByIdAndUpdate(order._id, { status: nextStatus });
        console.log(`✅ Progressed order ${order.orderNumber} to ${nextStatus}`);
      }
    }
    
    res.json({ message: 'Orders progressed successfully', processed: orders.length });
  } catch (error) {
    console.error('Error progressing orders:', error);
    res.status(500).json({ message: 'Error progressing orders' });
  }
});

// Reset all orders to pending
router.post('/reset-orders', async (req, res) => {
  try {
    await Order.updateMany({}, { status: 'pending' });
    res.json({ message: 'All orders reset to pending' });
  } catch (error) {
    console.error('Error resetting orders:', error);
    res.status(500).json({ message: 'Error resetting orders' });
  }
});

module.exports = router;