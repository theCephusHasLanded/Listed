/**
 * Script to generate the runtime environment configuration file
 * This creates a JavaScript file that will be loaded at runtime
 * to provide the Firebase configuration without exposing it in the source code
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Path to the output file
const outputFilePath = path.resolve(__dirname, '../public/env-config.js');

// Create the configuration object with environment variables
const config = {
  FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Generate the JavaScript file content
const fileContent = `// Runtime environment configuration
// This file is generated during build and should not be committed to source control
window.ENV = ${JSON.stringify(config, null, 2)};`;

// Write the file
fs.writeFileSync(outputFilePath, fileContent);

console.log('Runtime environment configuration generated at public/env-config.js');