import json
import boto3
import os

bedrock = boto3.client('bedrock-runtime', region_name=os.getenv('MY_AWS_REGION', 'ap-south-1'))

def generate_posts(topic):
    prompt_file = os.path.join(os.path.dirname(__file__), 'prompts', 'social_media_prompt.txt')
    
    with open(prompt_file, 'r') as f:
        prompt_template = f.read()
    
    prompt = prompt_template.replace("{topic}", topic)

    payload = {
        "prompt": prompt,
        "max_tokens_to_sample": 500,
        "temperature": 0.8,
        "top_p": 0.9
    }

    response = bedrock.invoke_model(
        modelId="anthropic.claude-v2",
        body=json.dumps(payload)
    )

    result = json.loads(response['body'].read())
    posts = result['completion'].strip().split('\n\n')
    
    return [post.strip() for post in posts if post.strip()]