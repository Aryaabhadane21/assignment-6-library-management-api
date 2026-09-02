const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'books';

class BookModel {
  /**
   * Create a new book document
   * @param {Object} bookData
   * @returns {Object} Created book object
   */
  static async createBook(bookData) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc();
    const bookId = docRef.id;
    const now = new Date().toISOString();

    const quantity = Number(bookData.quantity);
    const status = bookData.status || (quantity > 0 ? 'available' : 'borrowed');

    const newBook = {
      bookId,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      status,
      quantity,
      createdAt: now
    };

    await docRef.set(newBook);
    return newBook;
  }

  /**
   * Get all books with optional filtering by category, status, or author
   * @param {Object} filters
   * @returns {Array<Object>}
   */
  static async getAllBooks(filters = {}) {
    const db = getDb();
    let query = db.collection(COLLECTION_NAME);

    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.author) {
      query = query.where('author', '==', filters.author);
    }

    const snapshot = await query.get();
    const books = [];
    snapshot.forEach((doc) => books.push(doc.data()));
    return books;
  }

  /**
   * Search books by title or author (case-insensitive substring match in-memory over full set or partial)
   * @param {string} queryTerm
   * @returns {Array<Object>}
   */
  static async searchBooks(queryTerm) {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const term = (queryTerm || '').toLowerCase().trim();

    const books = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const titleMatch = data.title && data.title.toLowerCase().includes(term);
      const authorMatch = data.author && data.author.toLowerCase().includes(term);

      if (titleMatch || authorMatch) {
        books.push(data);
      }
    });

    return books;
  }

  /**
   * Get book details by bookId
   * @param {string} bookId
   * @returns {Object|null}
   */
  static async getBookById(bookId) {
    const db = getDb();
    const doc = await db.collection(COLLECTION_NAME).doc(bookId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  /**
   * Update a book document
   * @param {string} bookId
   * @param {Object} updateData
   * @returns {Object|null}
   */
  static async updateBook(bookId, updateData) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const fieldsToUpdate = { ...updateData };
    if (fieldsToUpdate.quantity !== undefined) {
      fieldsToUpdate.quantity = Number(fieldsToUpdate.quantity);
      if (fieldsToUpdate.status === undefined) {
        fieldsToUpdate.status = fieldsToUpdate.quantity > 0 ? 'available' : 'borrowed';
      }
    }

    await docRef.update(fieldsToUpdate);
    const updatedDoc = await docRef.get();
    return updatedDoc.data();
  }

  /**
   * Delete a book document by bookId
   * @param {string} bookId
   * @returns {boolean}
   */
  static async deleteBook(bookId) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  }
}

module.exports = BookModel;
