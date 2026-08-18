from fastapi import APIRouter
from pydantic import BaseModel,Field
from app.rag.code_rag import ask_codebase

router=APIRouter(
    prefix="/codeChat",tags=["Chat"]
)

class ChatRequest(BaseModel):
    repository_id:str
    query:str
    top_k:int=Field(default=5, ge=1,le=10)
    
@router.post("/chat")
async def chat(request:ChatRequest):
    result=ask_codebase(
        query=request.query,
        repository_id=request.repository_id,
        top_k=request.top_k
    )
    return result
