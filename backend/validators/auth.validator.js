const ApiError = require('../utils/ApiError');

const validateRegister = (data) => {
  const { name, email, password, confirmPassword, targetRole, experienceLevel } = data;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Password and confirmPassword do not match');
  }

  if (targetRole !== undefined && (!targetRole || typeof targetRole !== 'string' || !targetRole.trim())) {
    errors.push('Target role is invalid');
  }

  if (experienceLevel && !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(experienceLevel)) {
    errors.push('Experience level must be BEGINNER, INTERMEDIATE, or ADVANCED');
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    targetRole: targetRole && targetRole.trim() ? targetRole.trim() : 'Full Stack Developer',
    experienceLevel: experienceLevel || 'BEGINNER'
  };
};

const validateLogin = (data) => {
  const { email, password } = data;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  return {
    email: email.trim().toLowerCase(),
    password
  };
};

module.exports = {
  validateRegister,
  validateLogin
};
