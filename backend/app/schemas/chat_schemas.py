from pydantic import BaseModel,Field

class Source(BaseModel):
    file_path:str
    chunk_index:int
    score:float

class CodeAnswer(BaseModel):
    answer:str
    confidence: float=Field(ge=0.0,le=1.0)
    sources: list[Source]