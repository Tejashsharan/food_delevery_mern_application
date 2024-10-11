// routes/order.js
const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new order (only by customers)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ message: 'Access denied' });

  const { restaurantId, items, total, deliveryAddress } = req.body;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const newOrder = new Order({
      user: req.user.id,
      restaurant: restaurant.id,
      items,
      total,
      deliveryAddress,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all orders for a specific user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.userId) return res.status(403).json({ message: 'Access denied' });

  try {
    const orders = await Order.find({ user: req.params.userId }).populate('restaurant', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get details of a specific order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update order status (only by restaurant owner)
router.put('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    order.status = status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Cancel an order (only by customer and if pending)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    if (order.status !== 'Pending')
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });

    await order.deleteOne();
    res.json({ message: 'Order cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
