const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const { 
  globalErrorHandler, 
  handleNotFound, 
  requestTimeout, 
  handleMalformedJSON 
} = require('./middleware/errorHandler');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Request timeout middleware (30 seconds)
app.use(requestTimeout(30000));

// Middleware
app.use(cors());

// Handle malformed JSON before express.json()
app.use(handleMalformedJSON);
app.use(express.json({ limit: '10mb' }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Equipment Tracker API is running!' });
});

// Equipment routes
app.use('/api/equipment', require('./routes/equipment'));

// Handle undefined routes (404)
app.use(handleNotFound);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;