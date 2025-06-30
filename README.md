# AutoPost.AI 🚀

Your smart social media content assistant ✨

AutoPost.AI is a web application that generates social media posts using AI, allows users to connect their Twitter/LinkedIn accounts, and optionally auto-posts the content to their profiles.

---

## 🌐 Live Demo

👉 https://social-media-post-generator-dimple-kanwars-projects.vercel.app/

---

## 🧠 Features

- Generate engaging social posts using AI
- Connect Twitter, Discord (coming soon) and LinkedIn(coming soon) via OAuth
- Copy to clipboard or post directly to Twitter(Need twitter upgrade, coming soon)
- Cookie-based token storage
- Real-time UI feedback (snackbars, tooltips)
- Built using AWS Lambda & SAM

---

## 🛠️ Tech Stack

| Frontend              | Backend                        | AWS Services                      |
|----------------------|--------------------------------|------------------------------------|
| React + MUI + Vite   | Python + Requests      | Lambda, API Gateway, DynamoDB     |
| Tailwind/MUI for UI  | Deployed via AWS SAM           | CloudWatch (logs)                 |

---

## 🧩 Architecture

    [ Vercel (Frontend: React/MUI) ] <==> [ API Gateway ] ==> [ AWS Lambda Functions ] <==> [ DynamoDB (session store) ]

---

## 📦 Folder Structure

      SOCIAL-MEDIA-POST-GENERATOR/
      ├── backend/                    # AWS Lambda backend
      │   ├── app.py
      │   ├── twitter.py              # twitter related functions
      │   ├── linkedin_callback.py
      │   ├── generator.py            # handler for post generation
      │   ├── requirements.txt
      │   ├── template.yaml           # SAM template
      │   └── samconfig.toml
      ├── public/
      │   └── autopost-ai-logo.png    # app logo
      ├── src/
      │   ├── assets/
      │   │   └── react.svg
      │   ├── components/
      │   │   ├── ConnectSocials.jsx
      │   │   ├── PostActions.jsx
      │   │   ├── PostGenerator.jsx
      │   │   └── TwitterCallback.jsx
      │   ├── App.jsx
      │   ├── main.jsx
      │   ├── App.css
      │   ├── index.css
      │   └── styles.css
      ├── .env.test
      ├── .env
      ├── .gitignore
      ├── index.html
      ├── vite.config.js
      ├── package.json
      ├── package-lock.json
      └── README.md


---

## 🚀 How We Used AWS Lambda

This app uses **AWS Lambda** to build a fully serverless backend:

| Lambda Function        | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `generate-post`        | Accepts a prompt and returns AI-generated post ideas                        |
| `twitter-login`        | Starts the OAuth 1.0a login flow with Twitter                               |
| `twitter-callback`     | Handles the OAuth verifier and stores tokens in DynamoDB                   |
| `post-to-twitter`      | Posts a tweet using saved access tokens                                    |

These are deployed via **AWS SAM** using the following template:

```yaml
Resources:
  GeneratePostFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.generate_post
      Runtime: python3.11
      Events:
        Api:
          Type: Api
          Properties:
            Path: /generate-post
            Method: POST            
```
            
## 🧪 How to Test Locally

Update the environment variables in the template.yaml file.

### Backend

    cd backend
    sam build
    sam local start-api

### Frontend

    npm install
    npm run dev

Create a .env file with:

    cp .env.test .env


## 🔐 OAuth Setup Notes

Twitter: You must whitelist your callback URL in the Twitter developer portal.

LinkedIn: Approved redirect URI must match exactly.

## 📜 License

MIT

## 👩‍💻 Author

Dimple Kanwar