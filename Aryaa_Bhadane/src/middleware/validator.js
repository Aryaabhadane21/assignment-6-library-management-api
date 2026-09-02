const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../utils/validation');

/**
 * Middleware to check validation results and handle errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check field inputs.',
      errors: formatValidationErrors(errors.array())
    });
  }
  next();
};

// Validation rules for Register
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'librarian'])
    .withMessage('Role must be either student or librarian')
];

// Validation rules for Login
const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation rules for Profile Update
const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation rules for Book Creation
const bookCreateValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['available', 'borrowed'])
    .withMessage('Status must be either available or borrowed')
];

// Validation rules for Book Update
const bookUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('isbn').optional().trim().notEmpty().withMessage('ISBN cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['available', 'borrowed'])
    .withMessage('Status must be either available or borrowed')
];

// Validation rules for User Role Update
const userRoleUpdateValidation = [
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'librarian'])
    .withMessage('Role must be either student or librarian')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  bookCreateValidation,
  bookUpdateValidation,
  userRoleUpdateValidation
};
