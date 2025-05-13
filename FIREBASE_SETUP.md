# Firebase Setup Guide for Listed

This guide will help you set up Firebase for the Listed application. Follow these steps to configure Firebase Authentication, Firestore, Storage, and Hosting.

## Prerequisites

1. Node.js and npm installed on your machine
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. A Google account

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Listed")
4. Choose whether to enable Google Analytics (recommended)
5. Complete the setup process

## Step 2: Register Your Web App

1. In the Firebase project dashboard, click the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "Listed Web")
3. Check "Also set up Firebase Hosting" if desired
4. Click "Register app"
5. Copy the Firebase configuration object, which looks like:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

6. Create a `.env` file in the root of your project and add these values:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

## Step 3: Configure Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the following providers:
   - Email/Password
   - Google
3. For Google sign-in, configure the OAuth consent screen if prompted

## Step 4: Set Up Firestore Database

1. Go to "Firestore Database" in the Firebase Console
2. Click "Create database"
3. Choose "Start in production mode" (or test mode if you're just experimenting)
4. Select a location closest to your target audience
5. Wait for the database to be provisioned

## Step 5: Set Up Firebase Storage

1. Go to "Storage" in the Firebase Console
2. Click "Get started"
3. Choose your security rules (start with test mode for development)
4. Select a location closest to your target audience

## Step 6: Deploy Security Rules

1. Login to Firebase from your terminal:
   ```
   firebase login
   ```

2. Initialize Firebase in your project:
   ```
   firebase init
   ```
   
   Select the following:
   - Firestore
   - Storage
   - Hosting
   - Emulators (optional but recommended for local development)

3. When prompted, select your Firebase project
4. Accept the default file names for security rules
5. For hosting, set your public directory to "build"
6. Configure as a single-page app
7. Set up GitHub Actions deploys if desired

4. Deploy the security rules:
   ```
   firebase deploy --only firestore:rules,storage:rules
   ```

## Step 7: Update Firebase Configuration in the App

The Firebase configuration file is already set up at `src/config/firebase.ts` to use environment variables. Make sure your `.env` file contains all the required variables as mentioned in Step 2.

## Step 8: Start Local Development

1. Start the development server:
   ```
   npm start
   ```

2. (Optional) Start Firebase emulators for local development:
   ```
   firebase emulators:start
   ```

## Step 9: Deploy to Firebase Hosting

1. Build the production version of the app:
   ```
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```
   firebase deploy --only hosting
   ```

3. Your app is now live! Firebase will provide you with a URL.

## Automated Deployment

The project includes a GitHub Actions workflow file at `.github/workflows/firebase-deploy.yml`. To use it:

1. Configure secrets in your GitHub repository settings:
   - `FIREBASE_SERVICE_ACCOUNT`: A Firebase service account token
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

2. Generate a Firebase service account token:
   ```
   firebase login:ci
   ```

3. Add the token to your GitHub repository secrets

Now, every push to the main branch will automatically deploy to Firebase Hosting.

## Firebase Security Rules

The project includes security rules for Firestore and Storage. These rules ensure that:

- User data is protected
- Pins can be read by anyone but only created/edited by authenticated users
- Boards can be private or public
- Only owners can delete their content

You can modify these rules in `firestore.rules` and `storage.rules` if needed.

## Firebase Emulators

For local development, you can use Firebase Emulators to simulate Firebase services without affecting your production data:

1. Start emulators:
   ```
   firebase emulators:start
   ```

2. The app is configured to connect to emulators when in development mode.

## Troubleshooting

- **Authentication issues**: Check that your Firebase project has the correct authentication methods enabled.
- **Firestore access denied**: Verify your security rules and that you're authenticated when making requests.
- **Deployment issues**: Make sure you have the correct permissions and that your build process is working correctly.
- **Environment variables not working**: Ensure you've created a `.env` file in the root directory with all the required Firebase configuration variables.
- **Emulator connection issues**: Make sure you're running the emulators and that the ports match those in the Firebase configuration.

For more help, refer to the [Firebase documentation](https://firebase.google.com/docs).