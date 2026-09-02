const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  searchBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const {
  borrowBook,
  returnBook
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  bookCreateValidation,
  bookUpdateValidation,
  validate
} = require('../middleware/validator');

/**
 * @route GET /api/books
 * @desc List all books (query filters: category, status, author)
 * @access Public / Authenticated
 */
router.get('/', getAllBooks);

/**
 * @route GET /api/books/search
 * @desc Search books by title/author
 * @access Public / Authenticated
 */
router.get('/search', searchBooks);

/**
 * @route GET /api/books/:id
 * @desc Get single book details
 * @access Public / Authenticated
 */
router.get('/:id', getBookById);

/**
 * @route POST /api/books
 * @desc Add a new book
 * @access Protected (Librarian only)
 */
router.post(
  '/',
  authenticateToken,
  requireRole('librarian'),
  bookCreateValidation,
  validate,
  addBook
);

/**
 * @route PUT /api/books/:id
 * @desc Update a book
 * @access Protected (Librarian only)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole('librarian'),
  bookUpdateValidation,
  validate,
  updateBook
);

/**
 * @route DELETE /api/books/:id
 * @desc Delete a book
 * @access Protected (Librarian only)
 */
router.delete('/:id', authenticateToken, requireRole('librarian'), deleteBook);

/**
 * @route POST /api/books/:id/borrow
 * @desc Borrow a book
 * @access Protected (Student only)
 */
router.post('/:id/borrow', authenticateToken, requireRole('student'), borrowBook);

/**
 * @route POST /api/books/:id/return
 * @desc Return a borrowed book
 * @access Protected (Student only)
 */
router.post('/:id/return', authenticateToken, requireRole('student'), returnBook);

module.exports = router;
