const BookModel = require('../models/bookModel');
const TransactionModel = require('../models/transactionModel');

/**
 * Borrow a book (Student only)
 * POST /api/books/:id/borrow
 */
const borrowBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const book = await BookModel.getBookById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${bookId}' not found.`
      });
    }

    if (book.quantity <= 0 || book.status === 'borrowed') {
      return res.status(400).json({
        success: false,
        message: 'This book is currently unavailable for borrowing.'
      });
    }

    // Check if user already has an active borrow transaction for this book
    const activeTx = await TransactionModel.findActiveTransaction(userId, bookId);
    if (activeTx) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active borrow transaction for this book.'
      });
    }

    // Decrement book quantity & update status
    const newQuantity = book.quantity - 1;
    const newStatus = newQuantity > 0 ? 'available' : 'borrowed';
    await BookModel.updateBook(bookId, {
      quantity: newQuantity,
      status: newStatus
    });

    // Create transaction
    const transaction = await TransactionModel.createBorrowTransaction(userId, bookId);

    return res.status(201).json({
      success: true,
      message: 'Book borrowed successfully.',
      data: {
        transaction,
        remainingQuantity: newQuantity,
        bookStatus: newStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return a borrowed book (Student only)
 * POST /api/books/:id/return
 */
const returnBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const book = await BookModel.getBookById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${bookId}' not found.`
      });
    }

    const activeTx = await TransactionModel.findActiveTransaction(userId, bookId);
    if (!activeTx) {
      return res.status(400).json({
        success: false,
        message: 'No active borrow record found for this book and user.'
      });
    }

    // Complete transaction
    const transaction = await TransactionModel.completeReturnTransaction(activeTx.transactionId);

    // Increment book quantity and ensure status is available
    const newQuantity = book.quantity + 1;
    await BookModel.updateBook(bookId, {
      quantity: newQuantity,
      status: 'available'
    });

    return res.status(200).json({
      success: true,
      message: 'Book returned successfully.',
      data: {
        transaction,
        currentQuantity: newQuantity,
        bookStatus: 'available'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all transactions (Librarian only)
 * GET /api/transactions
 */
const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await TransactionModel.getAllTransactions();
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: { transactions }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged-in user's transaction history
 * GET /api/transactions/my
 */
const getMyTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const transactions = await TransactionModel.getUserTransactions(userId);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: { transactions }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getAllTransactions,
  getMyTransactions
};
