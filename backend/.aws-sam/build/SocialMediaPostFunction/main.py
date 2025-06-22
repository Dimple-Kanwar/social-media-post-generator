from validator import validate_input
from generator import generate_posts
from response import format_response

import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    logger.info("Received event: %s", event)
    is_valid, data_or_error = validate_input(event)
    
    if not is_valid:
        return format_response(400, data_or_error)
    
    topic = data_or_error['topic']
    logger.info("topic: %s", topic)
    
    try:
        posts = generate_posts(topic)
        return format_response(200, {"topic": topic, "posts": posts})
    except Exception as e:
        return format_response(500, {"error": str(e)})