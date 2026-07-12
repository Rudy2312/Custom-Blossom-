const mongoose = require('mongoose');

let isUsingMock = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/custom_blossom';
    
    // Set a connection timeout to prevent hanging when Mongo is not running
    const options = {
      serverSelectionTimeoutMS: 3000, 
    };

    const conn = await mongoose.connect(connStr, options);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    isUsingMock = false;
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Switching to hybrid in-memory mock database mode.');
    console.warn(`Reason: ${err.message}`);
    isUsingMock = true;
  }
};

const getDBMode = () => isUsingMock;

module.exports = { connectDB, getDBMode };
