const mongoose = require('mongoose');
require('dotenv').config(); // For loading environment variables

const connectDB = async () => {
  try {
    // The connection string now points to 'mongodb://mongo:27017/food_app_db'
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
