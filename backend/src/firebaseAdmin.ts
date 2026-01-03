import admin from 'firebase-admin';
import path from 'path';

// Load the Master Key
// We use path.resolve to find the key wherever the server runs (Local or Render)
const serviceAccount = path.resolve(__dirname, '../serviceAccountKey.json');

// Check if already initialized (to prevent errors during hot-reloads)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
console.log("🔥 Firebase Admin Initialized Successfully!");