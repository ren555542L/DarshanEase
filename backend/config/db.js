const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast after 5s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️  DB Connection Warning: ${error.message}`);
    console.error(`   Make sure MongoDB is running: mongod --dbpath <your-path>\n`);
    // Don't exit – server still serves static files
  }
};

module.exports = connectDB;
