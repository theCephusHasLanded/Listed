# Secure Deployment Guide for Listed

This document outlines the secure deployment process for Listed to protect sensitive API keys and credentials.

## Protecting Firebase Configuration

Firebase API keys and configuration should **never** be hardcoded in your source code. While API keys for Firebase web projects are not considered highly sensitive (as they are visible in network requests), we should still follow security best practices to prevent misuse.

## Recommended Approach

### 1. Environment Variables

Store all Firebase configuration in environment variables:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
...etc
```

- For local development: Use a `.env` file (already in `.gitignore`)
- For CI/CD: Use your CI system's secure environment variables

### 2. Secure Deployment Scripts

We've created secure deployment scripts that:
- Use environment variables instead of hardcoded values
- Generate temporary configurations during build time
- Clean up sensitive information after deployment

### 3. Firebase Security Rules

Ensure your Firebase security rules are properly configured to prevent unauthorized access:
- Firestore rules 
- Storage rules
- Authentication settings

## How to Deploy Securely

### Local Secure Deployment

1. Ensure your `.env` file exists with all required Firebase variables
2. Run the secure deployment script: `npm run deploy:secure`

### CI/CD Secure Deployment

1. Add all Firebase configuration variables to your CI/CD system's secure environment variables
2. Use the provided scripts/set-firebase-config.js in your build pipeline
3. Never commit any files containing API keys or secrets

## Rotation of Compromised Keys

If you receive notification that your Firebase API keys have been exposed:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your Firebase project's settings
3. Under "Service accounts" find your Web API Key
4. Click "Regenerate key" to create a new API key
5. Update your environment variables with the new key
6. Deploy with the updated keys

## Security Best Practices

- Regularly rotate API keys
- Set up Firebase security rules
- Use Firebase App Check for additional security
- Monitor for unauthorized usage
- Set up budget alerts to detect unusual activity
- Keep all libraries and dependencies updated
- Use secure redirects and handle CORS properly

Remember: The security of your application depends on a combination of factors - not just API key management but also proper authentication, authorization, and data validation.