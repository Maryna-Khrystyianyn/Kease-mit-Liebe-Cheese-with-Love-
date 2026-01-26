import os
import json
from pathlib import Path

from llama_index.langchain_helpers.text_splitter import TokenTextSplitter
from llama_index.vector_stores import ChromaVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.schema import TextNode
import chromadb

# ===============================
# 1. Load environment variables (локально через dotenv, продакшн через Fly secrets)
# ===============================
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

from core.config import OPENAI_API_KEY, CHROMA_PATH, COLLECTION_NAME

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY не знайдено! Додайте секрет на Fly.io через `fly secrets set OPENAI_API_KEY=...`")

# ===============================
# 2. Helpers for loading files
# ===============================
def load_json_file(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_md_file(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return [{"text": f.read(), "doc_id": os.path.basename(path)}]

# ===============================
# 3. Converters for JSON → text
# ===============================
def convert_faqs(data):
    docs = []
    for item in data:
        text = (
            f"FAQ\nFrage: {item['question']}\nAntwort: {item['answer']}\n"
            f"Kategorie: {item['category']}\nTags: {', '.join(item.get('tags', []))}"
        )
        docs.append({"text": text, "doc_id": f"faq_{item['id']}"})
    return docs

def convert_products(data):
    docs = []
    for item in data:
        text = (
            f"Produktname: {item['name']}\nKategorie: {item['category']}\n"
            f"Beschreibung: {item['description']}\nPreis: {item['price']}\nVerfügbar: {item['available']}"
        )
        docs.append({"text": text, "doc_id": f"product_{item['id']}"})
    return docs

def convert_recipes(data):
    docs = []
    for item in data:
        text = (
            f"Rezept: {item['title']}\nKategorie: {item['category']}\n"
            f"Beschreibung: {item['description']}\nHerstellungsschritte:\n{item['body']}\n"
            f"Reifezeit: {item['aging_days']} Tage\nZutaten: {', '.join(item['ingredients'])}"
        )
        docs.append({"text": text, "doc_id": f"recipe_{item['id']}"})
    return docs

# ===============================
# 4. Load all documents
# ===============================
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

faqs_raw = load_json_file(DATA_DIR / "faqs.json")
products_raw = load_json_file(DATA_DIR / "products.json")
recipes_raw = load_json_file(DATA_DIR / "recipes.json")

policy = load_md_file(DATA_DIR / "delivery_policy.md")
issues = load_md_file(DATA_DIR / "faq_issues.md")
contact = load_md_file(DATA_DIR / "contact.md")
tech_doc = load_md_file(DATA_DIR / "tech_doc.md")

faqs = convert_faqs(faqs_raw)
products = convert_products(products_raw)
recipes = convert_recipes(recipes_raw)

all_docs = faqs + products + recipes + policy + issues + contact + tech_doc
print(f"Loaded {len(all_docs)} documents")

# ===============================
# 5. Chunking → TextNode
# ===============================
splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=50)

nodes = []
for doc in all_docs:
    text = doc["text"]
    chunks = splitter.split_text(text)
    for i, chunk in enumerate(chunks):
        node = TextNode(
            text=chunk,
            id_=f"{doc['doc_id']}_chunk_{i}",
            metadata={"source": doc["doc_id"]},
        )
        nodes.append(node)

print(f"Created {len(nodes)} nodes")

# ===============================
# 6. Embeddings
# ===============================
embedding_model = OpenAIEmbedding(api_key=OPENAI_API_KEY, model="text-embedding-3-small")

for node in nodes:
    node.embedding = embedding_model.get_text_embedding(node.text)

# ===============================
# 7. Chroma Vector Store
# ===============================
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(COLLECTION_NAME)

vectorstore = ChromaVectorStore(
    chroma_collection=collection,
    persist_dir=CHROMA_PATH
)

vectorstore.add(nodes)
vectorstore.persist(CHROMA_PATH)

print("DONE! Saved all embeddings into Chroma.")
