const ApiError = require('../utils/ApiError');

const validateUpdateProfile = (data) => {
  const { name, targetRole, experienceLevel } = data;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push('Name cannot be empty');
    } else if (name.trim().length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  }

  if (experienceLevel !== undefined) {
    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(experienceLevel)) {
      errors.push('Experience level must be BEGINNER, INTERMEDIATE, or ADVANCED');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  // Filter out any unauthorized fields (role, email, password)
  const sanitized = {};
  if (name !== undefined) sanitized.name = name.trim();
  if (targetRole !== undefined) sanitized.targetRole = targetRole.trim();
  if (experienceLevel !== undefined) sanitized.experienceLevel = experienceLevel;

  return sanitized;
};

const validateChangePassword = (data) => {
  const { currentPassword, newPassword, confirmNewPassword } = data;
  const errors = [];

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push('Current password is required');
  }

  if (!newPassword || typeof newPassword !== 'string') {
    errors.push('New password is required');
  } else if (newPassword.length < 6) {
    errors.push('New password must be at least 6 characters long');
  }

  if (!confirmNewPassword) {
    errors.push('Please confirm your new password');
  } else if (newPassword !== confirmNewPassword) {
    errors.push('New password and confirmation do not match');
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('New password must be different from the current password');
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  return {
    currentPassword,
    newPassword,
    confirmNewPassword
  };
};

module.exports = {
  validateUpdateProfile,
  validateChangePassword
};
