const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Mock payment processing
router.post('/process', asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful payment
  const paymentResult = {
    success: true,
    paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
    orderId,
    amount,
    status: 'completed',
    timestamp: new Date().toISOString(),
    paymentMethod
  };
  
  res.json(paymentResult);
}));

// Mock payment status check
router.get('/:paymentId/status', asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  
  // Mock payment status
  const status = {
    paymentId,
    status: 'completed',
    amount: 29.99,
    currency: 'USD',
    timestamp: new Date().toISOString()
  };
  
  res.json(status);
}));

module.exports = router;
