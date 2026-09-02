const UserModel = require('../models/userModel');

/**
 * List all registered users (Librarian only)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user details by ID (Librarian only)
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID '${userId}' not found.`
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
 * Change a user's role (Librarian only)
 * PUT /api/users/:id/role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const updatedUser = await UserModel.updateUser(userId, { role });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID '${userId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated successfully to '${role}'.`,
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user (Librarian only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const success = await UserModel.deleteUser(userId);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: `User with ID '${userId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `User with ID '${userId}' was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};
