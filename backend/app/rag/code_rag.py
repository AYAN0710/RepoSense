from langchain_core.prompts import ChatPromptTemplate
from app.llm.llm_service import llm
from app.retrieval.semantic_search import search_code
from app.schemas.chat_schemas import CodeAnswer

prompt=ChatPromptTemplate.from_template(
     """
You are DevGuard AI, an AI software-engineering assistant.

Answer the user's question using ONLY the provided repository context.

Rules:
- Do not invent code, files, functions, or behavior.
- If the repository context is empty, say:
  "I couldn't find relevant information in the indexed repository."
- If the context exists but is insufficient to answer the question, clearly say:
  "The indexed repository does not contain enough information to answer this."
- Do not make assumptions beyond the provided context.
- Explain the answer in simple technical language.
- Mention relevant file paths when available.

Repository Context:
{context}

User Question:
{question}
"""
)

structured_llm=llm.with_structured_output(CodeAnswer)

def ask_codebase(query:str,repository_id:str,top_k:int=5):
    results=search_code(
        query=query,
        repository_id=repository_id,
        top_k=top_k
    )
    if not results:
        return {
            "answer": "I couldn't find relevant information in the indexed repository.",
            "confidence":0.0,
            "sources": []
        }
    context_parts=[]
    for result in results:
        context_parts.append(
            f"""
            File: {result["file_path"]}
            Chunk: {result["chunk_index"]}
            Retrieval Score: {result["score"]}
            Code: {result["content"]}"""
        )
    context="\n".join(context_parts)
    messages=prompt.invoke({
        "context":context,
        "question":query
    })
    response = structured_llm.invoke(messages)
    return {
        "answer": response.answer,
        "confidence": response.confidence,
        "sources": [
            {
                "file_path": result["file_path"],
                "chunk_index": result["chunk_index"],
                "score": result["score"]
            }
            for result in results
        ]
    }
    