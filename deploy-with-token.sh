#!/bin/bash

# Deploy using a Firebase token
# This script is useful for CI/CD environments
# You need to generate a token first with: firebase login:ci

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Listed Token-Based Firebase Deployment ===${NC}"
echo -e "${BLUE}=============================================${NC}"

# Prompt for Firebase token if not provided
if [ -z "$FIREBASE_TOKEN" ]; then
  echo -e "${YELLOW}Please enter your Firebase CI token (generate with 'firebase login:ci'):${NC}"
  read -s FIREBASE_TOKEN
  echo
fi

if [ -z "$FIREBASE_TOKEN" ]; then
  echo -e "${RED}Error: Firebase token is required${NC}"
  exit 1
fi

# Deploy to Firebase hosting using the token
echo -e "${GREEN}Deploying to Firebase hosting...${NC}"
firebase deploy --only hosting --token "$FIREBASE_TOKEN" --non-interactive

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${BLUE}Your app is now live at: https://lkhn-listed.web.app${NC}"