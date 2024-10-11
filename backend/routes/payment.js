// routes/payment.js
const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Record a payment for an order (only by customer)
router.post('/:orderId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ message: 'Access denied' });

  const { paymentMethod, paymentStatus, paymentAmount } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    order.payment = { paymentMethod, paymentStatus, paymentAmount };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
