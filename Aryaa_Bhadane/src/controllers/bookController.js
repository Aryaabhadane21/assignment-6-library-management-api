const BookModel = require('../models/bookModel');

/**
 * Get all books with optional filtering by category, status, author
 * GET /api/books
 */
const getAllBooks = async (req, res, next) => {
  try {
    const { category, status, author } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (author) filters.author = author;

    const books = await BookModel.getAllBooks(filters);
    return res.status(200).json({
      success: true,
      count: books.length,
      data: { books }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search books by title or author
 * GET /api/books/search?q=queryTerm
 */
const searchBooks = async (req, res, next) => {
  try {
    const queryTerm = req.query.q || req.query.title || req.query.author || '';
    if (!queryTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter (q, title, or author) is required.'
      });
    }

    const books = await BookModel.searchBooks(queryTerm);
    return res.status(200).json({
      success: true,
      count: books.length,
      data: { books }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get details for a single book by ID
 * GET /api/books/:id
 */
const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await BookModel.getBookById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${bookId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new book (Librarian only)
 * POST /api/books
 */
const addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, quantity, status } = req.body;

    const newBook = await BookModel.createBook({
      title,
      author,
      isbn,
      category,
      quantity,
      status
    });

    return res.status(201).json({
      success: true,
      message: 'Book created successfully.',
      data: { book: newBook }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing book (Librarian only)
 * PUT /api/books/:id
 */
const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const updateData = req.body;

    const updatedBook = await BookModel.updateBook(bookId, updateData);
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${bookId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully.',
      data: { book: updatedBook }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a book (Librarian only)
 * DELETE /api/books/:id
 */
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const success = await BookModel.deleteBook(bookId);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${bookId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Book with ID '${bookId}' was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};
