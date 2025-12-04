'use client';

// ========================================
// FIREBASE CONFIGURATION
// ========================================
// This file is ready for Firebase integration.
// Simply replace the placeholder values with your actual Firebase credentials.
//
// STEPS TO ENABLE FIREBASE:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Google Authentication in Firebase Console
// 3. Replace the placeholder values below with your actual Firebase config
// 4. Uncomment the code in src/components/Auth.js (marked with FIREBASE comments)
// 5. Uncomment the code in src/slices/authSlice.js (marked with FIREBASE comments)
// 6. Comment out or remove the MOCK authentication sections
// ========================================

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration now uses environment variables for security
// Create a .env file in the root directory based on .env.example
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
