# AutoPost.AI - Smart Social Media Post Generator
Content creators and marketers often struggle with coming up with fresh, engaging posts for platforms like Instagram, Twitter/X, LinkedIn, or Facebook. Writing catchy captions and post ideas manually can be time-consuming.

## Deployment & Local Testing Steps

### Install AWS SAM CLI

    https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

### Build the app

    sam build
    

### Test locally

    sudo sam local start-api

### Deploy to AWS

    sam deploy --guided

### Delete the deployments

    sam delete

## Inspiration

In today’s fast-paced digital world, content creators and marketers are under constant pressure to produce fresh, engaging content. Whether it's for Instagram, Twitter/X, LinkedIn, or Facebook, coming up with catchy captions and post ideas can be time-consuming and repetitive.

I wanted to solve this problem by building a tool that uses AI to generate creative, ready-to-use social media posts , helping users save time while staying consistent and engaging.

Inspired by the power of large language models (LLMs) and serverless computing, I built an application that combines AWS Lambda , Amazon Bedrock , and modern cloud architecture to deliver a scalable, intelligent solution.

## What it does

An end-to-end AI-powered social media post generator that:

- Accepts a topic or theme from the user
- Uses Amazon Bedrock (with models like Anthropic Claude) to generate multiple creative posts
- Returns results via an API Gateway endpoint
- Has a React frontend for easy interaction
- Is fully serverless , scalable, and modular

The project includes:
- A clean folder structure with modular Python code
- An AWS SAM template for infrastructure-as-code
- A React frontend for user-friendly input and output
- Local testing using sam local

## How we built it

### Backend (AWS Lambda + AI)

- Used AWS Lambda as the core service to handle incoming requests.
- Integrated with Amazon Bedrock to generate high-quality text using LLMs.
- Implemented modular code (main.py, validator.py, generator.py, response.py) for better maintainability.
- Used AWS SAM CLI to build and deploy the serverless stack.

### Frontend (React)
- Created a simple UI using Vite + React .
- Connected it to the Lambda API to send topics and display generated posts.
- Styled with basic CSS for responsiveness and readability.

### Deployment & DevOps
- Defined infrastructure using AWS SAM template .
- Enabled local development and testing with sam build and sam local invoke.
- Used CloudFormation stacks for managing AWS resources.

## What we learned

- Serverless architecture is powerful and cost-effective for small to medium-scale apps.
- Modular Python code makes Lambda functions easier to test, debug, and scale.
- Amazon Bedrock makes it incredibly easy to integrate advanced AI capabilities into applications.
- Local testing with sam local helps catch issues before deployment.
- Managing IAM permissions is crucial when working with AWS services — especially when deploying via CloudFormation.

