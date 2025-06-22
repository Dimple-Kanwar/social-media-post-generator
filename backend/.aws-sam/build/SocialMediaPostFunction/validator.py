def validate_input(event):
    try:
        body = event.get('body')
        if not body:
            return False, {"error": "Empty request body"}
        
        data = eval(body)  # In real use, use json.loads()
        topic = data.get("topic")
        if not topic or len(topic.strip()) == 0:
            return False, {"error": "Missing or empty 'topic'"}
        
        return True, {"topic": topic.strip()}
    
    except Exception as e:
        return False, {"error": f"Invalid input: {str(e)}"}