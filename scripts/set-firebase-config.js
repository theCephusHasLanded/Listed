/**
 * Script to set Firebase configuration during CI/CD builds
 * This allows us to inject environment variables without hardcoding sensitive values
 * Run this script before the build process with:
 * node scripts/set-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

// Path to temporary environment file that will be created during build
const envFilePath = path.resolve(__dirname, '../.env.production.local');

// Create environment variables from CI system variables
// These will be obtained from secure environment variables in your CI system
const firebaseConfig = {
  REACT_APP_FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
};

// Create environment file content
const envFileContent = Object.entries(firebaseConfig)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Write to the environment file
fs.writeFileSync(envFilePath, envFileContent);

console.log('Firebase configuration set for production build!');