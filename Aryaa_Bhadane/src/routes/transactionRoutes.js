const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getMyTransactions
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

/**
 * @route GET /api/transactions
 * @desc Get all transactions in the library
 * @access Protected (Librarian only)
 */
router.get('/', authenticateToken, requireRole('librarian'), getAllTransactions);

/**
 * @route GET /api/transactions/my
 * @desc Get logged-in user's transaction history
 * @access Protected (Authenticated users)
 */
router.get('/my', authenticateToken, getMyTransactions);

module.exports = router;
