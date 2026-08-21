from langchain_core.prompts import ChatPromptTemplate
from app.llm.llm_service import llm
from app.retrieval.semantic_search import search_code
from app.schemas.bug_schemas import BugAnalysisResponse

bug_prompt=ChatPromptTemplate.from_template(
     """
You are DevGuard AI, an expert software-engineering code reviewer.

Analyze ONLY the repository code provided below.

User Request:
{query}

Repository ID:
{repository_id}

Repository Context:
{context}

Rules:

1. Report only bugs supported by the provided code.
2. Do not invent files, functions, or behavior.
3. Do not assume a retrieved chunk represents the complete file.
4. Never report a syntax error merely because a function,
   class, or statement appears incomplete in a chunk.
5. Do not report coding-style preferences as bugs.
6. Do not report theoretical vulnerabilities unless the
   provided code demonstrates the vulnerable behavior.
7. Do not duplicate the same issue.
8. Focus on concrete:
   - runtime errors
   - logical errors
   - security vulnerabilities
   - data integrity problems
   - incorrect API behavior
   - incorrect model/inference behavior
9. If no clearly identifiable bug exists, return an empty bugs list.
10. Only report issues relevant to the user's request.

Severity levels:

LOW:
Minor issue with limited impact.

MEDIUM:
Potentially incorrect behavior or moderate reliability issue.

HIGH:
Serious functional, security, or data-integrity problem.

CRITICAL:
Severe issue that could cause major damage, compromise,
or system failure.

For every bug provide:

- severity
- file_path
- chunk_index
- issue
- explanation
- suggested_fix

Do not provide explanations outside the structured response.
"""
)

structured_llm=llm.with_structured_output(BugAnalysisResponse)

def analyze_codebase(query:str,repository_id:str,top_k:int=8):
    #retrieve code existing Jina+Qdrant pipeline
    results=search_code(
        query=query,
        repository_id=repository_id,
        top_k=top_k
    )
    if not results:
        return BugAnalysisResponse(
            repository_id= repository_id,
            query= query,
            bugs= []
        )
    
    #build repo context
    context_parts=[]
    for result in results:
        context_parts.append(
            f"""
            File: {result["file_path"]}
            Chunk: {result["chunk_index"]}

            Code:
            {result["content"]}
            """
        )
    context="\n".join(context_parts)
    
    #build prompt
    messages=bug_prompt.invoke(
        {
            "query": query,
            "repository_id":repository_id,
            "context": context,
        }
    )
    
    result=structured_llm.invoke(messages)
    return BugAnalysisResponse(
    repository_id=repository_id,
    query=query,
    bugs=result.bugs
)

    # #llm to analyze code
    # response=llm.invoke(messages)
    # content=response.content
    
    # #llm can sometimes return structured content
    # if isinstance(content,list):
    #     content="".join(
    #         item.get("text","")
    #         if isinstance(item, dict)
    #         else str(item)
    #         for item in content
    #     )
    # return {
    #     "repository_id": repository_id,
    #     "query": query,
    #     "raw_analysis": content
    # }
    