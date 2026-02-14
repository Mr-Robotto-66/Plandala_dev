import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing Firebase environment variables: ${missing.join(', ')}`
    };
  }

  return { valid: true };
};

// Initialize Firebase
let app;
let db;
let storage;
let auth;
let firebaseError = null;
let isFirebaseConfigured = false;

const validation = validateFirebaseConfig();

if (!validation.valid) {
  firebaseError = validation.error;
  console.error('Firebase configuration error:', firebaseError);
} else {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    console.log('Firebase initialized successfully');
  } catch (error) {
    firebaseError = error.message;
    console.error('Error initializing Firebase:', error);
  }
}

export const getFirebaseError = () => firebaseError;
export { app, db, storage, auth, isFirebaseConfigured };
