const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { userRoleUpdateValidation, validate } = require('../middleware/validator');

// All routes in userController require Librarian role
router.use(authenticateToken, requireRole('librarian'));

/**
 * @route GET /api/users
 * @desc List all users
 * @access Protected (Librarian only)
 */
router.get('/', getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user details by ID
 * @access Protected (Librarian only)
 */
router.get('/:id', getUserById);

/**
 * @route PUT /api/users/:id/role
 * @desc Change a user's role
 * @access Protected (Librarian only)
 */
router.put('/:id/role', userRoleUpdateValidation, validate, updateUserRole);

/**
 * @route DELETE /api/users/:id
 * @desc Delete a user
 * @access Protected (Librarian only)
 */
router.delete('/:id', deleteUser);

module.exports = router;
