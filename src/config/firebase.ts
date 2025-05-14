import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Access runtime configuration from window.ENV
declare global {
  interface Window {
    ENV: {
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGING_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MEASUREMENT_ID: string;
    };
  }
}

// Function to get Firebase config with safeguards
const getFirebaseConfig = () => {
  // Default configuration from environment variables
  const envConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

  // If window.ENV is available, use those values instead
  if (typeof window !== 'undefined' && window.ENV) {
    return {
      apiKey: window.ENV.FIREBASE_API_KEY || envConfig.apiKey,
      authDomain: window.ENV.FIREBASE_AUTH_DOMAIN || envConfig.authDomain,
      projectId: window.ENV.FIREBASE_PROJECT_ID || envConfig.projectId,
      storageBucket: window.ENV.FIREBASE_STORAGE_BUCKET || envConfig.storageBucket,
      messagingSenderId: window.ENV.FIREBASE_MESSAGING_SENDER_ID || envConfig.messagingSenderId,
      appId: window.ENV.FIREBASE_APP_ID || envConfig.appId,
      measurementId: window.ENV.FIREBASE_MEASUREMENT_ID || envConfig.measurementId,
    };
  }

  return envConfig;
};

// Get the config
const firebaseConfig = getFirebaseConfig();

// Check if we have a valid configuration
const isValidConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

// Initialize Firebase only if we have a valid configuration
let app, auth, db, storage, analytics;

try {
  if (isValidConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // Initialize analytics only in browser environments
    analytics = (typeof window !== 'undefined') ? getAnalytics(app) : null;

    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase configuration is missing. Authentication will not work.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Connect to emulators in development
if (auth && db && storage && process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, auth, db, storage, analytics };