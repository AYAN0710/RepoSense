from pathlib import Path
from qdrant_client import QdrantClient
from qdrant_client.models import Distance,VectorParams,PointStruct
from langchain_qdrant import QdrantVectorStore
from app.config.settings import settings
from app.embeddings.embedding_service import embedding_model

BASE_DIR=Path(__file__).resolve().parent.parent.parent.parent
VECTOR_DB_PATH=BASE_DIR/"vector_database"

client=QdrantClient(
    path=str(VECTOR_DB_PATH)
)

def create_collection(vector_size:int):
    collections=client.get_collections().collections
    collection_exists=any(
        collection.name==settings.qdrant_collection for collection in collections
    )
    if not collection_exists:
        client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE
            )
        )
    return settings.qdrant_collection

def get_vector_store():
    vector_store=QdrantVectorStore(
        client=client,
        collection_name=settings.qdrant_collection,
        embedding=embedding_model
    )
    return vector_store

def store_chunks(chunks):
    vector_store=get_vector_store()
    vector_store.add_documents(chunks)
    return {
        'vectors_stored':len(chunks)
    }