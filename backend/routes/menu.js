// routes/menu.js
const express = require('express');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Add a new menu item to a restaurant (only by restaurant owner)
router.post('/:restaurantId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Access denied' });

  const { name, price, description, img } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    const newMenuItem = new MenuItem({
      name,
      price,
      description,
      img,
      restaurant: restaurant.id,
    });

    const savedMenuItem = await newMenuItem.save();
    restaurant.menu.push(savedMenuItem.id);
    await restaurant.save();

    res.json(savedMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all menu items for a specific restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    // Get query parameters for price and name
    const { price, name } = req.query;

    // Build the query object dynamically
    let query = { restaurant: req.params.restaurantId };

    // Add price filter if provided
    if (price) {
      query.price = { $lte: price }; // Use $lte (less than or equal to) for price filtering
    }

    // Add name filter if provided
    if (name) {
      query.name = new RegExp(name, 'i'); // Case-insensitive regex search for name
    }

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// Update a menu item (only by restaurant owner)
router.put('/:restaurantId/:itemId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Access denied' });

  const { name, price, description, available } = req.body;
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    menuItem.name = name || menuItem.name;
    menuItem.price = price || menuItem.price;
    menuItem.description = description || menuItem.description;
    menuItem.available = available !== undefined ? available : menuItem.available;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a menu item (only by restaurant owner)
router.delete('/:restaurantId/:itemId', authMiddleware, async (req, res) => {
  // Check if the user has the 'restaurant' role
  if (req.user.role !== 'restaurant') return res.status(403).json({ message: 'Access denied' });

  try {
    // Find the menu item by its ID
    const menuItem = await MenuItem.findById(req.params.itemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    // Find the restaurant associated with the menu item
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    // Check if the current user is the owner of the restaurant
    if (restaurant.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    // Delete the menu item from the MenuItem collection
    await menuItem.deleteOne();

    // Remove the reference of the menu item from the Restaurant model's menu array
    restaurant.menu = restaurant.menu.filter(itemId => itemId.toString() !== req.params.itemId);

    // Save the updated restaurant document
    await restaurant.save();

    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
