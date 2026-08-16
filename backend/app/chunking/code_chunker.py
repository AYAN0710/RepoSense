from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def chunk_code(documents:list[Document]) -> list[Document]:
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=[
            "\nclass ",
            "\ndef ",
            "\nfunction ",
            "\n\n",
            "\n",
            " ",
            ""
        ]
    )
    chunks=splitter.split_documents(documents)
    for index,chunk in enumerate(chunks):
        chunk.metadata['chunk_index']=index
    return chunks
