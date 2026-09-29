const express = require('express');
const corsMiddleware = require('./config/cors');
const apiRoutes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const securityMiddleware = require('./middlewares/security.middleware');

const app = express();

app.disable('x-powered-by');

// Middlewares
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
