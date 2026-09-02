const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'users';

class UserModel {
  /**
   * Create a new user document in Firestore
   * @param {Object} userData
   * @returns {Object} Created user object (without password)
   */
  static async createUser(userData) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc();
    const userId = docRef.id;
    const now = new Date().toISOString();

    const newUser = {
      userId,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'student',
      createdAt: now,
      updatedAt: now
    };

    await docRef.set(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Object|null}
   */
  static async findByEmail(email) {
    const db = getDb();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  /**
   * Find user by userId
   * @param {string} userId
   * @returns {Object|null}
   */
  static async findById(userId) {
    const db = getDb();
    const doc = await db.collection(COLLECTION_NAME).doc(userId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  /**
   * Retrieve all users (excluding passwords)
   * @returns {Array<Object>}
   */
  static async getAllUsers() {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const users = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      delete data.password;
      users.push(data);
    });

    return users;
  }

  /**
   * Update user details
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Object|null} Updated user object without password
   */
  static async updateUser(userId, updateData) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const updatedFields = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updatedFields.email) {
      updatedFields.email = updatedFields.email.toLowerCase();
    }

    await docRef.update(updatedFields);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    delete data.password;
    return data;
  }

  /**
   * Delete user by userId
   * @param {string} userId
   * @returns {boolean} True if deleted, false if user not found
   */
  static async deleteUser(userId) {
    const db = getDb();
    const docRef = db.collection(COLLECTION_NAME).doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  }
}

module.exports = UserModel;
