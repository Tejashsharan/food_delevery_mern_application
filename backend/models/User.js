const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: { type: String }, // Removed 'unique: true'
  role: { type: String, enum: ['customer', 'restaurant', 'delivery'], required: true, default: 'customer' },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add a partial index to ensure 'googleId' is unique only when it is not null
UserSchema.index({ googleId: 1 }, { unique: true, partialFilterExpression: { googleId: { $exists: true } } });

module.exports = mongoose.model('User', UserSchema);
