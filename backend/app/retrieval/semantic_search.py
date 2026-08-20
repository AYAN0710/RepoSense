from qdrant_client.models import Filter,FieldCondition,MatchValue
from app.vectorstore.qdrant_service import get_vector_store
from app.reranking.code_reranker import rerank_documents

MIN_RELEVANCE_SCORE=0.40

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
    
    #VECTOR RETRIEVAL
    retrieved_documents=vector_store.similarity_search_with_score(
        query=query,k=15,filter=repository_filter
    )
    
    #REMOVE WEAK ONES
    retrieved_documents=[
        (document,score) for document,score in retrieved_documents if float(score)>=MIN_RELEVANCE_SCORE
    ]
    
    #CROSS ENCODER RERANKING
    reranked_documents=rerank_documents(
        query=query,documents=retrieved_documents,top_k=top_k
    )
    
    results = []

    for item in reranked_documents:

        document = item["document"]

        results.append({
            "file_path": document.metadata.get("file_path"),
            "extension": document.metadata.get("extension"),
            "chunk_index": document.metadata.get("chunk_index"),
            "score": item["retrieval_score"],
            "rerank_score": item["rerank_score"],
            "content": document.page_content
        })

    return results
   
    
        