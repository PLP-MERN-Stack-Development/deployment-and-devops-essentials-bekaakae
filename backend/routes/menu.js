const express = require('express');
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Get all menu items - available at both /api/menu and /api/menu/items
router.get('/', asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ available: true });
  res.json(items);
}));

// ADD THIS ROUTE - to support /api/menu/items
router.get('/items', asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ available: true });
  res.json(items);
}));

// Get menu item by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  res.json(item);
}));

module.exports = router;