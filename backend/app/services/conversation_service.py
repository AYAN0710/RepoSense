from collections import defaultdict
from langchain_core.messages import HumanMessage,AIMessage

conversation_history=defaultdict(list)

def add_user_message(repository_id:str,message:str):
    conversation_history[repository_id].append(HumanMessage(content=message))
    
def add_ai_message(repository_id:str,message:str):
    conversation_history[repository_id].append(AIMessage(content=message))
    
def get_history(repository_id:str):
    return conversation_history.get(
        repository_id,[]
    )

def clear_history(repository_id:str):
    conversation_history.pop(repository_id,None)