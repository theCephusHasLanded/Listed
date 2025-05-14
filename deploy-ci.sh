#!/bin/bash

# CI/CD deployment script for Listed
# This script injects Firebase configuration from environment variables into the template

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Listed CI/CD Deployment ===${NC}"
echo -e "${BLUE}=============================${NC}"

# Verify required environment variables
echo -e "${GREEN}Verifying required environment variables...${NC}"
REQUIRED_VARS=(
  "FIREBASE_API_KEY"
  "FIREBASE_AUTH_DOMAIN"
  "FIREBASE_PROJECT_ID"
  "FIREBASE_STORAGE_BUCKET"
  "FIREBASE_MESSAGING_SENDER_ID"
  "FIREBASE_APP_ID"
  "FIREBASE_MEASUREMENT_ID"
)

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo -e "${RED}Error: Required environment variable $VAR is not set${NC}"
    exit 1
  fi
done

# Generate runtime configuration from template
echo -e "${GREEN}Generating runtime configuration from template...${NC}"
TEMPLATE_FILE="public/env-config.js.template"
CONFIG_FILE="public/env-config.js"

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo -e "${RED}Error: Template file $TEMPLATE_FILE not found${NC}"
  exit 1
fi

# Copy template to config file
cp "$TEMPLATE_FILE" "$CONFIG_FILE"

# Replace placeholders with actual values
for VAR in "${REQUIRED_VARS[@]}"; do
  sed -i'' -e "s/\\[\\[$VAR\\]\\]/${!VAR}/g" "$CONFIG_FILE"
done

echo -e "${GREEN}Runtime configuration generated at $CONFIG_FILE${NC}"

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

# Check if Firebase token is provided
if [ -z "$FIREBASE_TOKEN" ]; then
  echo -e "${YELLOW}No Firebase token provided. Attempting interactive login.${NC}"
  firebase deploy --only hosting
else
  echo -e "${GREEN}Using provided Firebase token for deployment.${NC}"
  firebase deploy --only hosting --token "$FIREBASE_TOKEN" --non-interactive
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check the errors above.${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${BLUE}Your app is now live at: https://lkhn-listed.web.app${NC}"