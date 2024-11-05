// routes/restaurant.js
const express = require('express');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new restaurant (only for users with role 'restaurant')
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Access denied' });

  const { name, description, address, cuisine, img } = req.body;
  try {
    console.log(req.user.id)
    const newRestaurant = new Restaurant({
      name,
      description,
      owner: req.user.id,
      address,
      cuisine,
      img
    });

    const savedRestaurant = await newRestaurant.save();
    res.json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { name, cuisine } = req.query;

    // Create a query object with conditions based on provided parameters
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // case-insensitive search
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' }; // case-insensitive search
    }

    const restaurants = await Restaurant.find(query).populate('owner', 'name');
    return res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



// Get a specific restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a restaurant (only by owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    const { name, description, address, cuisine } = req.body;
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.address = address || restaurant.address;
    restaurant.cuisine = cuisine || restaurant.cuisine;

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a restaurant (only by owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    await restaurant.remove();
    res.json({ message: 'Restaurant removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
