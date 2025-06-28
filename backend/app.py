from generator import build_messages
import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configure the Bedrock client
bedrock = boto3.client("bedrock-runtime",region_name=os.environ.get("MY_AWS_REGION", "ap-south-1"))
MODEL_ID = os.environ.get("MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")

def lambda_handler(event, context):
    try:
        # CORS preflight
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
                "body": json.dumps({"message": "CORS preflight passed"})
            }

        # Parse prompt
        body = json.loads(event.get("body","{}"))
        user_prompt = body.get("prompt","").strip()
        if not user_prompt:
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Prompt is required."})
            }

        # Build the messages list
        messages = [
            {
                "role": "user",
                "content": (
                    "You are a social media expert. "
                    "Based on the following user prompt, generate 3 engaging social media post ideas "
                    "that include emojis and relevant hashtags, and respond strictly in JSON "
                    "with top‐level key \"posts\" containing an array of three strings.\n\n"
                    f"User prompt: {user_prompt}"
                )
            }
        ]

        # Invoke Claude via Messages API with correct schema
        payload = {
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7,
            "anthropic_version": "bedrock-2023-05-31"
        }

        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(payload),
            contentType="application/json",
            accept="application/json"
        )

        # Parse the flat message response
        resp_body = json.loads(response["body"].read())
        # resp_body example: { "id": "...", "model":"...", "type":"message", "role":"assistant",
        #   "content":[ {type:"text", text:"{ \"posts\":[...]}"} ], ... }
        content_blocks = resp_body.get("content", [])
        # Extract and concatenate only the text blocks
        assistant_text = "".join(
            block["text"] for block in content_blocks
            if block.get("type") == "text" and "text" in block
        )

        # Now parse that JSON string into a Python dict
        result = json.loads(assistant_text)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps(result)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }