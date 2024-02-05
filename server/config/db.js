const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/Queue';

const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDb;