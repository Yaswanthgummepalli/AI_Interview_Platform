const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (!(err instanceof ApiError)) {
    // Handle Mongoose / Mongo specific errors if needed
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid resource ID: ${err.path}`;
    } else if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map((val) => val.message).join(', ');
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;
