from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.chat import ChatRequest, ChatResponse
from memory.session_memory import (
    get_history,
    append_turn,
    build_context,
)
from rag.retriever import retrieve_and_answer
from core.config import OPENAI_API_KEY, CHROMA_PATH, COLLECTION_NAME

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user_id = req.user_id
    message = req.message

    # 1. Памʼять
    history = get_history(user_id)
    context_text = build_context(history)

    # 2. Формуємо фінальний prompt
    full_prompt = (
    "Du bist ein hilfreicher Assistent für einen Käseladen.\n"
    "Deine Aufgabe ist es, einfache, klare und freundliche Antworten zu geben, in der Sprache, in der der Nutzer dich anspricht (meistens Deutsch).\n"
    "Du liebst Käse, kennst alle Feinheiten der Käseherstellung und inspirierst sowie unterstützt den Nutzer bei seinen Vorhaben, Käse zuzubereiten.\n"
    "Verwende Dokumente, wenn sie für die Anfrage relevant sind.\n"
    "Wenn der Nutzer ähnliche Fragen wiederholt stellt, schlage höflich vor, den Webseitenadministrator zu kontaktieren — eine großartige Person und Käsemeister — per E-Mail: svitlamaryna@gmail.com.\n\n"
    f"Dialogverlauf:\n{context_text}\n"
    f"Benutzerfrage: {message}"
)


    # 3. Отримуємо відповідь
    answer = retrieve_and_answer(full_prompt)

    # 4. Оновлюємо памʼять
    append_turn(user_id, "user", message)
    append_turn(user_id, "assistant", answer)

    return ChatResponse(answer=answer)
