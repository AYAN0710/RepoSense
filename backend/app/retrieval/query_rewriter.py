from langchain_core.prompts import ChatPromptTemplate
from app.llm.llm_service import llm

rewrite_prompt=ChatPromptTemplate.from_template(
    """
    You are a query rewriting component for a codebase question-answering system.

Rewrite the user's current question into a standalone search query
that can be used to retrieve relevant code from a repository.

Use the conversation history to resolve references such as:
- it
- this
- that
- the function
- the model
- the previous step

Rules:
- Preserve the user's original intent.
- Do not answer the question.
- Do not invent repository information.
- Return ONLY the rewritten search query.
- If the question is already standalone, return it unchanged.

Conversation History:
{history}

Current Question:
{question}"""
)

def rewrite_query(query: str, history: str) -> str:
    messages = rewrite_prompt.invoke({
        "history": history,
        "question": query
    })
    response = llm.invoke(messages)

    content = response.content

    if isinstance(content, list):
        content = "".join(
            item.get("text", "")
            if isinstance(item, dict)
            else str(item)
            for item in content
        )

    return content.strip()