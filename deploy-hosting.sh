#!/bin/bash

# Listed - Firebase Hosting Deploy Script (Non-interactive)

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Listed Firebase Hosting Deployment ===${NC}"
echo -e "${BLUE}==========================================${NC}"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo -e "${RED}Error: Firebase CLI is not installed${NC}"
    echo -e "Please install it using: ${YELLOW}npm install -g firebase-tools${NC}"
    exit 1
fi

# Check if user is logged in to Firebase
echo -e "${GREEN}Checking Firebase authentication...${NC}"
FIREBASE_USER=$(firebase login:list | grep -o "[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}")

if [ -z "$FIREBASE_USER" ]; then
    echo -e "${RED}Not logged in to Firebase. Please log in:${NC}"
    firebase login
else
    echo -e "${GREEN}Logged in as: $FIREBASE_USER${NC}"
fi

# Build the project
echo -e "${GREEN}Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully.${NC}"

# Deploy to Firebase Hosting
echo -e "${GREEN}Deploying hosting only to Firebase...${NC}"
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${BLUE}Your app is now live.${NC}"