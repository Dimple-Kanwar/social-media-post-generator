import os
import json
import requests

def lambda_handler(event, context):
    params = event.get("queryStringParameters", {})
    code = params.get("code")

    if not code:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing LinkedIn auth code"})
        }

    # Exchange auth code for access token
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.environ["LINKEDIN_REDIRECT_URI"],
        "client_id": os.environ["LINKEDIN_CLIENT_ID"],
        "client_secret": os.environ["LINKEDIN_CLIENT_SECRET"],
    }

    print("Exchanging code for access token with data:", data)
    # Set headers for the request
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    token_res = requests.post(token_url, data=data, headers=headers)
    token_data = token_res.json()
    print("Token response:", token_data)
    if "access_token" in token_data:
        access_token = token_data["access_token"]
        print("Access token:", access_token)
        # You can store this token in DB, cookies, or session
        res = {
            "statusCode": 302,
            "headers": {
                "Set-Cookie": f"linkedin_connected=true; Path=/; Secure; HttpOnly",
                "Location": "/?linkedin=connected"
            },
            "body": ""
        }
        return res

    return {
        "statusCode": 500,
        "body": json.dumps({"error": "Token exchange failed", "details": token_data})
    }
