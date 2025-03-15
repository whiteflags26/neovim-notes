const express = require('express');
const cors = require('cors');
const noteRouter = require('../server/routes/noteRoutes');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();

// CORS configuration
const corsConfig = {
  origin: process.env.FRONTEND_URL || '*', // Allow all origins if FRONTEND_URL is not set
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsConfig)); // Use CORS with the configuration
app.options('*', cors(corsConfig)); // Enable preflight requests for all routes

// Middleware
app.use(express.json());

// Routes
app.use('/api/notes', noteRouter);

// Default route
app.get('/', (req, res) => {
  res.send('API running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with a failure code
  }
};

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit the process if the server fails to start
  }
};

startServer();