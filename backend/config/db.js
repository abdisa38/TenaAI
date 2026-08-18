const mongoose = require('mongoose');

const connectDB = () => {
  if (!process.env.MONGODB_URI) {
    console.warn('[MongoDB Notice] MONGODB_URI not set. Running in mock/in-memory mode.');
    return;
  }

  mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    })
    .then((conn) => {
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.warn(`[MongoDB Warning] Connection error (${error.message}). Server continues in mock mode.`);
    });
};

module.exports = connectDB;
