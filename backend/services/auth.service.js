const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

class AuthService {
  generateToken(userId, role) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, 'JWT_SECRET is not configured on the server');
    }

    return jwt.sign(
      { id: userId, role },
      secret,
      { expiresIn: '7d' }
    );
  }

  async registerUser(userData) {
    const { name, email, password, targetRole, experienceLevel } = userData;

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'An account with this email address already exists');
    }

    // Create user (password will be hashed via pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      targetRole,
      experienceLevel,
      role: 'USER'
    });

    const token = this.generateToken(user._id, user.role);

    return {
      user: user.toSafeObject(),
      token
    };
  }

  async loginUser({ email, password }) {
    // Select password explicitly since it has select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = this.generateToken(user._id, user.role);

    return {
      user: user.toSafeObject(),
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user.toSafeObject();
  }
}

module.exports = new AuthService();
