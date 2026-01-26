from typing import Dict, List

# user_id -> list of {role, text}
chat_sessions: Dict[str, List[dict]] = {}

def get_history(user_id: str):
    if user_id not in chat_sessions:
        chat_sessions[user_id] = []
    return chat_sessions[user_id]

def append_turn(user_id: str, role: str, text: str):
    chat_sessions[user_id].append({
        "role": role,
        "text": text
    })

def build_context(history, max_turns: int = 6) -> str:
    context = ""
    for turn in history[-max_turns:]:
        context += f"{turn['role']}: {turn['text']}\n"
    return context
