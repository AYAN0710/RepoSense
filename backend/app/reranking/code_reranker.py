from langchain_community.cross_encoders import HuggingFaceCrossEncoder


RERANKER_MODEL = "BAAI/bge-reranker-base"


reranker = HuggingFaceCrossEncoder(
    model_name=RERANKER_MODEL
)


def rerank_documents(
    query: str,
    documents: list,
    top_k: int = 5
):
    if not documents:
        return []

    pairs = []

    for item in documents:
        document, retrieval_score = item

        pairs.append([
            query,
            document.page_content
        ])

    scores = reranker.score(pairs)

    ranked_results = []

    for item, rerank_score in zip(documents, scores):

        document, retrieval_score = item

        ranked_results.append({
            "document": document,
            "retrieval_score": float(retrieval_score),
            "rerank_score": float(rerank_score)
        })

    ranked_results.sort(
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    return ranked_results[:top_k]