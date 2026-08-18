from qdrant_client.models import Filter,FieldCondition,MatchValue
from app.vectorstore.qdrant_service import get_vector_store

def search_code(query:str,repository_id:str,top_k:int=5):
    vector_store=get_vector_store()
    repository_filter=Filter(
        must=[
            FieldCondition(
                key="metadata.repository_id",
                match=MatchValue(value=repository_id)
            )
        ]
    )
    retriever=vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k":top_k,
            "filter":repository_filter
        }
    )
    documents=retriever.invoke(query)
    results=[]
    for document in documents:
        results.append({
            "file_path": document.metadata.get("file_path"),
            "extension": document.metadata.get("extension"),
            "chunk_index": document.metadata.get("chunk_index"),
            "content": document.page_content
        })
    return results