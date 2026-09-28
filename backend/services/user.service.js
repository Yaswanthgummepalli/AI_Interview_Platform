const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

class UserService {
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user.toSafeObject();
  }

  async updateUserProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Apply allowed updates
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.targetRole !== undefined) user.targetRole = updateData.targetRole;
    if (updateData.experienceLevel !== undefined) user.experienceLevel = updateData.experienceLevel;

    await user.save();
    return user.toSafeObject();
  }

  async changeUserPassword(userId, { currentPassword, newPassword }) {
    // Select password explicitly for verification
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    // Assign new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return user.toSafeObject();
  }
}

module.exports = new UserService();
