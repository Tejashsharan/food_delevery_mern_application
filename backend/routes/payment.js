const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay instance with credentials
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_KEY
});

// Log the loaded environment variables (make sure these print correctly)
console.log('Razorpay Key ID:', process.env.KEY_ID);
console.log('Razorpay Secret Key:', process.env.SECRET_KEY);

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
    console.error('Error saving payment to order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to create a Razorpay order
router.post('/create-order', authMiddleware, async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  // Log the incoming request body
  console.log('Create order request body:', req.body);

  // Validate that the amount is a valid number
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: 'Invalid amount specified' });
  }

  const options = {
    amount: amount * 100,  // Convert to the smallest currency unit
    currency,
  };

  try {
    // Log the options being sent to Razorpay
    console.log('Razorpay order options:', options);

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    // Log the created order
    console.log('Razorpay order created:', order);

    // Respond with the order details
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);  // Logging error message
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

module.exports = router;
