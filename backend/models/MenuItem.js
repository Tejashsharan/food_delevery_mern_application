const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  img: { type: String },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  available: { type: Boolean, default: true }
});
module.exports = mongoose.model('MenuItem', MenuItemSchema);