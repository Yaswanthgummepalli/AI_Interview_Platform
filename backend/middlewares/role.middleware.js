const ApiError = require('../utils/ApiError');

/**
 * Middleware for role-based authorization.
 * Usage: protect, authorizeRoles('ADMIN') or protect, authorizeRoles('USER', 'ADMIN')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required. User context missing.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' does not have sufficient permissions.`
        )
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
