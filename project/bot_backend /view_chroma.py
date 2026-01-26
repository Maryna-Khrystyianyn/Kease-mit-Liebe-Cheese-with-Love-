import chromadb
from core.config import CHROMA_PATH, COLLECTION_NAME

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_collection(COLLECTION_NAME)

print("=== Загальна інформація ===")
print("Кількість документів у колекції:", collection.count())

print("\n=== Всі документи ===")
data = collection.get(include=["documents", "metadatas"])


for i, (doc_id, doc_text, meta) in enumerate(
    zip(data["ids"], data["documents"], data["metadatas"])
):
    print(f"\n--- Документ {i+1} ---")
    print("ID:", doc_id)
    print("Metadata:", meta)
    print("Text:")
    print(doc_text)
    print("-" * 80)
