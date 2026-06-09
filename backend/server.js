const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-project';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Database.'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Ensure MongoDB is installed and running locally on standard port (27017) or specify MONGO_URI in .env');
  });

// Welcome / Health check route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running successfully.' });
});

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
