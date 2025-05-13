#!/bin/bash

# Listed - Firebase Deployment Script

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Listed Deployment Script ===${NC}"
echo -e "${BLUE}=================================${NC}"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo -e "${RED}Error: Firebase CLI is not installed${NC}"
    echo -e "Please install it using: ${YELLOW}npm install -g firebase-tools${NC}"
    exit 1
fi

# Check if user is logged in to Firebase
echo -e "${GREEN}Checking Firebase authentication...${NC}"
firebase login:list > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to login to Firebase first${NC}"
    firebase login
fi

# Build the project
echo -e "${GREEN}Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully.${NC}"

# Deploy to Firebase
echo -e "${GREEN}Deploying to Firebase...${NC}"

# Ask which services to deploy
echo -e "${YELLOW}What would you like to deploy?${NC}"
echo "1. Everything (Hosting, Firestore, Storage)"
echo "2. Hosting only"
echo "3. Firestore rules only"
echo "4. Storage rules only"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}Deploying everything...${NC}"
        firebase deploy
        ;;
    2)
        echo -e "${GREEN}Deploying hosting only...${NC}"
        firebase deploy --only hosting
        ;;
    3)
        echo -e "${GREEN}Deploying Firestore rules only...${NC}"
        firebase deploy --only firestore:rules
        ;;
    4)
        echo -e "${GREEN}Deploying Storage rules only...${NC}"
        firebase deploy --only storage
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${BLUE}Thank you for using Listed deployment script.${NC}"