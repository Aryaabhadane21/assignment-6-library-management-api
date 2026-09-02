const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let db;

try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
    }
    db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.warn(
      'Warning: Firebase credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) not fully configured in environment variables.'
    );
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
}

module.exports = {
  admin,
  getDb: () => {
    if (!db) {
      if (admin.apps.length) {
        db = admin.firestore();
        return db;
      }
      throw new Error(
        'Firestore is not initialized. Please ensure valid Firebase credentials are set in environment variables.'
      );
    }
    return db;
  }
};
