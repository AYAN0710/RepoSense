from pathlib import Path
from langchain_core.documents import Document

def load_code_files(files:list[dict],repository_id:str):
    documents=[]
    for file in files:
        file_path=Path(file["absolute_path"])
        try:
            content=file_path.read_text(encoding='utf-8')
            document=Document(
                page_content=content,
                metadata={
                     "repository_id": repository_id,
                    "file_path": file["path"],
                    "extension": file["extension"],
                    "size": file["size"]
                }
            )
            documents.append(document)
        except (UnicodeDecodeError,OSError):
            continue
    return documents