#!/bin/bash

# Clean up previous builds
rm -rf dist vendor
mkdir -p dist/lambda vendor bedrock/prompts

# Copy source files
cp lambda/*.py dist/lambda/
cp -r bedrock/prompts dist/lambda/

# Install dependencies
pip install -r requirements.txt --target vendor
cp -r vendor/* dist/lambda/

# Build and deploy
sam build
sam deploy --guided