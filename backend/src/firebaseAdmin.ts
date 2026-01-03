import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Check if we are already initialized
if (!admin.apps.length) {
  try {
    // SCENARIO 1: CLOUD (Render) ☁️
    // If the secret variable exists, use it!
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log("☁️ Loading Firebase Credential from Environment Variable...");
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
    } 
    // SCENARIO 2: LOCAL (Your Laptop) 💻
    // Otherwise, look for the file
    else {
      console.log("💻 Loading Firebase Credential from Local File...");
      const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
    }
    
    console.log("🔥 Firebase Admin Initialized Successfully!");

  } catch (error) {
    console.error("❌ Firebase Auth Error:", error);
  }
}

export const db = admin.firestore();