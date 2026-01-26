import chromadb
from llama_index.embeddings.openai import OpenAIEmbedding
from core.config import  CHROMA_PATH, COLLECTION_NAME
import os
from openai import OpenAI

# Це отримує ключ із середовища (Fly.io секрети)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if OPENAI_API_KEY is None:
    raise ValueError("OPENAI_API_KEY is not set in environment!")


# ===============================
# 1. Ініціалізуємо Chroma
# ===============================
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(COLLECTION_NAME)

# ===============================
# 2. Embedding модель
# ===============================
embedding_model = OpenAIEmbedding(
    model="text-embedding-3-small",
    openai_api_key=OPENAI_API_KEY
)

# ===============================
# 3. LLM
# ===============================
llm = OpenAI(api_key=OPENAI_API_KEY)

# ===============================
# 4. Функція для пошуку та відповіді
# ===============================
def retrieve_and_answer(prompt: str) -> str:

    # 1. Embedding запиту
    query_emb = embedding_model.get_text_embedding(prompt)

    # 2. Прямий запит у Chroma
    result = collection.query(
        query_embeddings=[query_emb],
        n_results=3
    )

    # 3. Формуємо контекст
    # result["documents"] — це список списків
    documents = result["documents"][0]
    context = "\n\n".join(documents)

    # 4. Prompt
    full_prompt = f"""
Використай цей контекст для відповіді:

{context}

Питання: {prompt}
"""

    # 5. Відповідь
    response = llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": full_prompt}]
    )

    return response.choices[0].message.content
