from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.retrieval.semantic_search import search_code

router=APIRouter(
    prefix='/searchCode',tags=['Search']
)

class SearchRequest(BaseModel):
    repository_id:str
    query:str
    top_k: int=Field(default=5 , ge=1, le=20)
    
@router.post("/search")
async def search_repository(request:SearchRequest):
    results=search_code(
        query=request.query,
        repository_id=request.repository_id,
        top_k=request.top_k
    )
    return {
        "repository_id": request.repository_id,
        "query": request.query,
        "results": results
    }