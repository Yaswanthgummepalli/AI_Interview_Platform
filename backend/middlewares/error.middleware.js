const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errors = Array.isArray(err.errors) ? err.errors : [];

  if (!(err instanceof ApiError)) {
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid resource ID: ${err.path || 'unknown field'}`;
    } else if (err.code === 11000) {
      statusCode = 409;
      const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'field';
      if (field === 'email') {
        message = 'Email is already registered';
      } else {
        message = 'Duplicate field value entered';
      }
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(err.errors).map((val) => val.message);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      message,
      stack: err.stack
    });
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {})
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
