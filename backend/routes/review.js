// routes/review.js
const express = require('express');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Add a review to a restaurant (only by customers)
router.post('/:restaurantId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ message: 'Access denied' });

  const { rating, comment } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const newReview = new Review({
      user: req.user.id,
      restaurant: restaurant.id,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all reviews for a specific restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a review (only by the reviewer)
router.delete('/:restaurantId/:reviewId', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    await review.remove();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
