#!/bin/bash

# Secure deployment script for Listed
# This script handles Firebase deployment without exposing API keys in code

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Listed Secure Firebase Deployment ===${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}Error: .env file not found. Please create it with your Firebase configuration.${NC}"
  exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
  echo -e "${RED}Error: Firebase CLI is not installed${NC}"
  echo -e "Please install it using: npm install -g firebase-tools"
  exit 1
fi

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Set temporary environment variables for the build process
echo -e "${GREEN}Setting up secure Firebase configuration...${NC}"
node scripts/set-firebase-config.js

# Build the project
echo -e "${GREEN}Building the project with secure configuration...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
  # Clean up temporary files
  rm -f .env.production.local
  exit 1
fi

echo -e "${GREEN}Build completed successfully.${NC}"

# Deploy to Firebase Hosting
echo -e "${GREEN}Deploying to Firebase...${NC}"
firebase deploy --only hosting

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
  # Clean up temporary files
  rm -f .env.production.local
  exit 1
fi

# Clean up temporary files
rm -f .env.production.local

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${BLUE}Your app is now live at: https://lkhn-listed.web.app${NC}"