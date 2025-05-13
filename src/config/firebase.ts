import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyCWDRQTJoEShllUiQ1cZvMlQPa4E1nDHOM',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'lkhn-listed.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'lkhn-listed',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'lkhn-listed.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '611602532536',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:611602532536:web:15699731328d890af24c4d',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-J80C1217DM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// Initialize analytics only in browser environments
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, auth, db, storage, analytics };