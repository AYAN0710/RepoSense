from langchain_huggingface import HuggingFaceEmbeddings
from app.config.settings import settings

embedding_model=HuggingFaceEmbeddings(
    model_name=settings.embedding_model,
    model_kwargs={
        "trust_remote_code":True
    },
    encode_kwargs={
        'normalize_embeddings':True
    }
)

def embed_documents(documents):
    texts=[document.page_content for document in documents]
    embeddings=embedding_model.embed_documents(texts)
    return embeddings