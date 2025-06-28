def build_messages(user_prompt: str):
    return [
        {"author": "system", "content": "You are a social media expert."},
        {"author": "user",   "content": user_prompt}
    ]