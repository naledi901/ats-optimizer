// frontend/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR CONFIG HERE ---
// (Go to Firebase Console -> Project Settings -> General -> Scroll down to "Your apps")
const firebaseConfig = {
  apiKey: "AIzaSyDcsurbyEyA8SL4FzNQPTNUD6wXChg6WUY",
  authDomain: "ats-cv-optimizer-92595.firebaseapp.com",
  projectId: "ats-cv-optimizer-92595",
  storageBucket: "ats-cv-optimizer-92595.firebasestorage.app",
  messagingSenderId: "89327479608",
  appId: "1:89327479608:web:690514d5cb2d69c2f06fcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools so other files can use them
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);