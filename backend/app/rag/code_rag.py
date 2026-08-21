from langchain_core.prompts import ChatPromptTemplate
from app.llm.llm_service import llm
from app.retrieval.semantic_search import search_code
from app.schemas.chat_schemas import CodeAnswer
from app.services.conversation_service import add_ai_message,add_user_message,get_history
from app.retrieval.query_rewriter import rewrite_query

prompt = ChatPromptTemplate.from_template(
    """
You are DevGuard AI, an AI software-engineering assistant.

Answer the user's question using ONLY the provided repository context
and conversation history.

Rules:
- Do not invent code, files, functions, or behavior.
- If the repository context is empty, say:
  "I couldn't find relevant information in the indexed repository."
- If the context exists but is insufficient to answer the question, clearly say:
  "The indexed repository does not contain enough information to answer this."
- Use conversation history to understand follow-up questions.
- Do not make assumptions beyond the provided repository context.
- Explain the answer in simple technical language.
- Mention relevant file paths when available.
- Do not mention files that are not present in the provided context.

Conversation History:
{history}

Repository Context:
{context}

User Question:
{question}
"""
)

def ask_codebase(query:str,repository_id:str,top_k:int=5):
    
    #get conversation history
    history_messages=get_history(repository_id)
    history="\n".join(
        f"{message.__class__.__name__}: {message.content}"
        for message in history_messages
    )
    
    #rewrite current question for retrieval
    search_query=rewrite_query(query=query,history=history)
    
    print("Original query:", query)
    print("Search query:", search_query)
    
    #rewrite repo context
    results=search_code(
        query=search_query,
        repository_id=repository_id,
        top_k=top_k
    )
    
    context_parts=[]
    for result in results:
        context_parts.append(
            f"""
            File: {result["file_path"]}
            Chunk: {result["chunk_index"]}
            Code:
            {result["content"]}""" 
        )
    
    context="\n".join(context_parts)
    
   
    
    #generate answer
    messages=prompt.invoke(
        {
            "history": history,
            "context": context,
            "question": query
        }
    )
    
    #answer generation
    response=llm.invoke(messages)
    content=response.content
    
    #handle gemini response list
    if isinstance(content, list):
        answer = "".join(
        item.get("text", "")
        if isinstance(item, dict)
        else str(item)
        for item in content
    )
    else:
        answer = str(content)
        
    #calculate confidence
    if results:
        scores=[float(result["score"]) for result in results]
        confidence=max(0.0,min(1.0,sum(scores)/len(scores)))
    else:
        confidence=0.0
    
    #save conv.
    add_user_message(repository_id,query)
    add_ai_message(repository_id,answer)
    
    
    #build structured response
    result=CodeAnswer(
        answer=answer,
        confidence=confidence,
        sources=[
            {
               "file_path": item["file_path"],
                "chunk_index": item["chunk_index"],
                "score": item["score"] 
            }
            for item in results
        ]
    )
    return result

