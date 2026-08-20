from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings

from app.config.settings import settings


class JinaCodeEmbeddings(Embeddings):

    def __init__(self):
        self.model = SentenceTransformer(
            settings.embedding_model,
            trust_remote_code=True,
            device="cuda"
        )

    def embed_documents(
        self,
        texts: list[str]
    ) -> list[list[float]]:

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        return embeddings.tolist()

    def embed_query(
        self,
        text: str
    ) -> list[float]:

        query = (
            "Represent this query for searching relevant code: "
            + text
        )

        embedding = self.model.encode(
            query,
            normalize_embeddings=True
        )

        return embedding.tolist()


embedding_model = JinaCodeEmbeddings()


def embed_documents(documents):
    """
    Generate embeddings for LangChain Documents.
    """

    texts = [
        document.page_content
        for document in documents
    ]

    return embedding_model.embed_documents(texts)