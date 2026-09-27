const authService = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const validatedData = validateRegister(req.body);
    const result = await authService.registerUser(validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = validateLogin(req.body);
    const result = await authService.loginUser(validatedData);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    const user = await authService.getCurrentUser(req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, 'Current user retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
