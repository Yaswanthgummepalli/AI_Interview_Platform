const userService = require('../services/user.service');
const { validateUpdateProfile, validateChangePassword } = require('../validators/user.validator');
const ApiResponse = require('../utils/ApiResponse');

const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { user: profile }, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const validatedData = validateUpdateProfile(req.body);
    const updatedUser = await userService.updateUserProfile(req.user._id, validatedData);
    return res
      .status(200)
      .json(new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const validatedData = validateChangePassword(req.body);
    await userService.changeUserPassword(req.user._id, validatedData);
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Password changed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
