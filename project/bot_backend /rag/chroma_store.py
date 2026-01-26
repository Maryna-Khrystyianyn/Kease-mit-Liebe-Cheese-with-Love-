import chromadb
from llama_index.vector_stores import ChromaVectorStore
from llama_index.core import VectorStoreIndex

from core.config import CHROMA_PATH, COLLECTION_NAME

def load_index():
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = client.get_collection(COLLECTION_NAME)

    vector_store = ChromaVectorStore(chroma_collection=collection)
    index = VectorStoreIndex.from_vector_store(vector_store)

    return index
