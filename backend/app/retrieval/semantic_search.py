from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.vectorstore.qdrant_service import get_vector_store


def search_code(
    query: str,
    repository_id: str,
    top_k: int = 5
):
    vector_store = get_vector_store()

    repository_filter = Filter(
        must=[
            FieldCondition(
                key="metadata.repository_id",
                match=MatchValue(value=repository_id)
            )
        ]
    )

    retrieved_documents = vector_store.similarity_search_with_score(
        query=query,
        k=15,
        filter=repository_filter
    )

    retrieved_documents=retrieved_documents[:top_k]
    
    results = []

    for document, score in retrieved_documents:
        results.append({
            "file_path": document.metadata.get("file_path"),
            "extension": document.metadata.get("extension"),
            "chunk_index": document.metadata.get("chunk_index"),
            "score": float(score),
            "content": document.page_content
        })

    return results