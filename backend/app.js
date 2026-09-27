const express = require('express');
const corsMiddleware = require('./config/cors');
const apiRoutes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to InterviewAI Backend API'
  });
});

// 404 Handler
app.use(notFoundMiddleware);

// Centralized Error Handler
app.use(errorMiddleware);

module.exports = app;
