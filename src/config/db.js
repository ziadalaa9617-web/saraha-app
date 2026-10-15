const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('database connected');
  } catch (err) {
    console.log('database error:', err.message);
  }
};

module.exports = connectDB;