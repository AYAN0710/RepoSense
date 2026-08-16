from fastapi import FastAPI
from app.config.settings import settings
from app.api.routes.repository import router as repository_router

app=FastAPI(title=settings.app_name)

@app.get("/")
def check_health():
    return {
        "message":"Running successfully"
    }
    
app.include_router(repository_router)