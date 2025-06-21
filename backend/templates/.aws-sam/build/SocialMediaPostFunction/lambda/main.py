import json
from validator import validate_input
from generator import generate_posts
from response import format_response

def lambda_handler(event, context):
    is_valid, data_or_error = validate_input(event)
    
    if not is_valid:
        return format_response(400, data_or_error)
    
    topic = data_or_error['topic']
    
    try:
        posts = generate_posts(topic)
        return format_response(200, {"topic": topic, "posts": posts})
    except Exception as e:
        return format_response(500, {"error": str(e)})