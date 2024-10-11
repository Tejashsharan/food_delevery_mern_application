const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Delivered', 'Cancelled'], default: 'Pending' },
  deliveryAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
