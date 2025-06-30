import os
from urllib.parse import parse_qs
from requests_oauthlib import OAuth1Session
import json
import boto3


dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get("SESSION_TABLE_NAME", "TwitterOAuthSessions")
session_table = dynamodb.Table(table_name)

def twitter_login(event, context):
    try:
        oauth = OAuth1Session(
            os.environ["TWITTER_CLIENT_KEY"],
            client_secret=os.environ["TWITTER_CLIENT_SECRET"],
            callback_uri=os.environ.get("TWITTER_CALLBACK_URL", "http://localhost:3000/auth/callback/twitter")
        )
        fetch_response = oauth.fetch_request_token("https://api.twitter.com/oauth/request_token")
        resource_owner_key = fetch_response.get("oauth_token")
        resource_owner_secret = fetch_response.get("oauth_token_secret")

        # Save the secret in DynamoDB
        session_table.put_item(Item={
            "oauth_token": resource_owner_key,
            "oauth_token_secret": resource_owner_secret
        })

        auth_url = oauth.authorization_url("https://api.twitter.com/oauth/authorize")
        return {
            "statusCode": 302,
            "headers": {
                "Location": auth_url
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Login failed", "details": str(e)})
        }

def twitter_callback(event, context):
    try:
        query = event.get('queryStringParameters') or {}
        oauth_token = query.get('oauth_token')
        oauth_verifier = query.get('oauth_verifier')

        if not oauth_token or not oauth_verifier:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing oauth_token or oauth_verifier"})
            }

        response = session_table.get_item(Key={"oauth_token": oauth_token})
        resource_owner_secret = response.get("Item", {}).get("oauth_token_secret")

        if not resource_owner_secret:
            return {
                "statusCode": 403,
                "body": json.dumps({"error": "Invalid or expired session"})
            }

        oauth = OAuth1Session(
            os.environ["TWITTER_CLIENT_KEY"],
            client_secret=os.environ["TWITTER_CLIENT_SECRET"],
            resource_owner_key=oauth_token,
            resource_owner_secret=resource_owner_secret,
            verifier=oauth_verifier
        )
        access_tokens = oauth.fetch_access_token("https://api.twitter.com/oauth/access_token")

        access_token = access_tokens.get("oauth_token")
        access_token_secret = access_tokens.get("oauth_token_secret")

        if access_token and access_token_secret:
            frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
            return {
                "statusCode": 302,
                "headers": {
                    "Location": f"{frontend_url}/auth/callback/twitter?token={access_token}&secret={access_token_secret}"
                }
            }
        else:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "Access token missing", "tokens": access_tokens})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Callback failed", "details": str(e)})
        }

def post_to_twitter(event, context):
    try:
        if event["httpMethod"] == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST,OPTIONS"
                },
                "body": json.dumps({"success": True})
            }
        
        body = json.loads(event.get('body', '{}'))
        status = body.get('content')
        token = body.get('token')
        secret = body.get('secret')

        if not status or not token or not secret:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        oauth = OAuth1Session(
            os.environ["TWITTER_CLIENT_KEY"],
            client_secret=os.environ["TWITTER_CLIENT_SECRET"],
            resource_owner_key=token,
            resource_owner_secret=secret
        )

        res = oauth.post(
            "https://api.twitter.com/1.1/statuses/update.json",
            params={"status": status}
        )

        if res.status_code == 200:
            return {
                "statusCode": 200,
                "body": json.dumps({"success": True})
            }
        else:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "Post failed", "response": res.text})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST,OPTIONS"
            },
            "body": json.dumps({"error": "Exception occurred", "details": str(e)})
        }
