from pydantic import BaseModel,Field
from typing import Literal

class BugReport(BaseModel):
    severity: Literal["LOW","MEDIUM","HIGH","CRITICAL"]
    file_path:str
    chunk_index: int | None=None
    issue:str
    explanation:str
    suggested_fix:str
    
class BugAnalysis(BaseModel):
    bugs: list[BugReport] = Field(
        default_factory=list
    )
    
class BugAnalysisResponse(BaseModel):
    repository_id:str
    query:str
    bugs: list[BugReport] = Field(default_factory=list)