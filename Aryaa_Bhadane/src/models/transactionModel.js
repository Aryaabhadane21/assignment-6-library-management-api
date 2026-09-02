const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'transactions';

class TransactionModel {
  /**
   * Create a new borrow transaction
   * @param {string} userId
   * @param {string} bookId
   * @returns {Object}
   */
  static async createBorrowTransaction(userId, bookId) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc();
    const transactionId = docRef.id;

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days due date

    const newTransaction = {
      transactionId,
      userId,
      bookId,
      type: 'borrow',
      borrowDate: borrowDate.toISOString(),
      returnDate: null,
      dueDate: dueDate.toISOString(),
      status: 'active'
    };

    await docRef.set(newTransaction);
    return newTransaction;
  }

  /**
   * Find an active transaction for a given user and book
   * @param {string} userId
   * @param {string} bookId
   * @returns {Object|null}
   */
  static async findActiveTransaction(userId, bookId) {
    const db = getDb();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  /**
   * Complete a return transaction
   * @param {string} transactionId
   * @returns {Object|null}
   */
  static async completeReturnTransaction(transactionId) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc(transactionId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const now = new Date().toISOString();
    const updateData = {
      type: 'return',
      returnDate: now,
      status: 'returned'
    };

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    return updatedDoc.data();
  }

  /**
   * Get all transactions in system (librarian only)
   * @returns {Array<Object>}
   */
  static async getAllTransactions() {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const transactions = [];

    const now = new Date();

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Check for overdue status dynamically if active and past due date
      if (data.status === 'active' && new Date(data.dueDate) < now) {
        data.status = 'overdue';
      }
      transactions.push(data);
    });

    return transactions;
  }

  /**
   * Get transactions for a specific user
   * @param {string} userId
   * @returns {Array<Object>}
   */
  static async getUserTransactions(userId) {
    const db = getDb();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('userId', '==', userId)
      .get();

    const transactions = [];
    const now = new Date();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'active' && new Date(data.dueDate) < now) {
        data.status = 'overdue';
      }
      transactions.push(data);
    });

    return transactions;
  }
}

module.exports = TransactionModel;
