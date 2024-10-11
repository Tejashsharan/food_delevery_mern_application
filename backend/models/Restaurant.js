const mongoose = require('mongoose');
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  cuisine: { type: String },
  img: { type: String },
  rating: { type: Number, default: 0 },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
});
module.exports = mongoose.model('Restaurant', RestaurantSchema);
