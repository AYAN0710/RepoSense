from fastapi import APIRouter
from pydantic import BaseModel,Field
from app.services.bug_service import analyze_codebase

router=APIRouter(
    prefix="/bugs",tags=["Bugs Detection"]
)

class BugRequest(BaseModel):
    repository_id:str
    query: str=Field(
        default="Find potential bugs in the repository."
    )
    top_k: int=Field(default=8,ge=1,le=15)
    
@router.post("/analyze")
async def analyze_bugs(request:BugRequest):
    result=analyze_codebase(
        query=request.query,
        repository_id=request.repository_id,
        top_k=request.top_k
    )
    return result
