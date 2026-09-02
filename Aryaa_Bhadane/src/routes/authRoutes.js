const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  validate
} = require('../middleware/validator');

/**
 * @route POST /api/auth/register
 * @desc Register user (student/librarian)
 * @access Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT
 * @access Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route GET /api/auth/profile
 * @desc Get logged in user profile
 * @access Protected
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Update logged in user profile
 * @access Protected
 */
router.put('/profile', authenticateToken, profileUpdateValidation, validate, updateProfile);

module.exports = router;
