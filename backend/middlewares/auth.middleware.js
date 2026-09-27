const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. No token provided.'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new ApiError(401, 'User belonging to this token no longer exists.'));
      }

      // Attach user to req object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token has expired. Please log in again.'));
      }
      return next(new ApiError(401, 'Invalid authentication token.'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect
};
