import shutil
import subprocess
import uuid
from pathlib import Path
from fastapi import HTTPException

BASE_DIR=Path(__file__).resolve().parent.parent.parent
REPOSITORY_DIR=BASE_DIR/"uploads"

REPOSITORY_DIR.mkdir(parents=True,exist_ok=True)

def clone_repository(github_url:str):
    #clone a gitub repo locally
    repository_id=str(uuid.uuid4())
    repository_path=REPOSITORY_DIR/repository_id
    try:
        result=subprocess.run([
            "git","clone","--depth","1",github_url,str(repository_path)
        ],
        capture_output=True,text=True,timeout=140)
        
        if result.returncode!=0:
            if repository_path.exists():
                shutil.rmtree(repository_path)
            raise HTTPException(
                status_code=400,detail='Unable to clone GitHub repository.'
            )
        return {
            "repository_id": repository_id,
            "repository_path": str(repository_path),
            "repository_url": github_url
        }
    except subprocess.TimeoutExpired:
        if repository_path.exists():
            shutil.rmtree(repository_path)
        raise HTTPException(
            status_code=408,
            detail='Repository cloning timed out.'
        )
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail='Git is not installed or not available in PATH.'
        )
    

