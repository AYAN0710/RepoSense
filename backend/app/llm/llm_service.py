from langchain_google_genai import ChatGoogleGenerativeAI
from app.config.settings import settings

llm=ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    google_api_key=settings.google_api_key,
    temperature=0.5
)