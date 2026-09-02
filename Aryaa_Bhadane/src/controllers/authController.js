const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * Register a new user (student or librarian)
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and generate JWT token
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const tokenPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };

    const token = generateToken(tokenPayload);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged-in user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update logged-in user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.userId;

    const updateFields = {};

    if (name) updateFields.name = name;

    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.userId !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use by another user.'
        });
      }
      updateFields.email = email;
    }

    if (password) {
      updateFields.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updatedUser = await UserModel.updateUser(userId, updateFields);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
