const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('database connected');
  } catch (err) {
    console.log('database error:', err.message);
  }
};

module.exports = connectDB;