from fastapi import FastAPI
from app.config.settings import settings
from app.api.routes.repository import router as repository_router
from app.api.routes.search import router as search_router
from app.api.routes.chat import router as chat_router
from app.api.routes.bug_router import router as bug_router

app=FastAPI(title=settings.app_name)

@app.get("/")
def check_health():
    return {
        "message":"Running successfully"
    }
    
app.include_router(repository_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(bug_router)