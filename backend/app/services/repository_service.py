import os
import shutil
import uuid
from pathlib import Path
from zipfile import ZipFile
from fastapi import UploadFile
from app.config.settings import settings

# BASE_DIR=Path(__file__).resolve().parent.parent.parent
# UPLOAD_DIR=BASE_DIR/"uploads"

def save_repository(file:UploadFile):
    # UPLOAD_DIR.mkdir(parents=True,exist_ok=True)
    
    upload_dir=Path(settings.upload_dir)
    upload_dir.mkdir(parents=True,exist_ok=True)
    repository_id=str(uuid.uuid4())
    filename=f"{repository_id}_{file.filename}"
    saved_path=upload_dir/filename
    try:
        with saved_path.open("wb") as buffer:
            shutil.copyfileobj(file.file,buffer)
    finally:
        file.file.close()
    return{
        "repository_id":repository_id,
        "filename":file.filename,
        "saved_path":str(saved_path)
    }

def extract_repository(zip_path:str,repository_id:str):
    zip_path=Path(zip_path)
    upload_dir=Path(settings.upload_dir)
    extraction_dir=upload_dir/repository_id
    extraction_dir.mkdir(parents=True,exist_ok=True)
    with ZipFile(zip_path,"r") as zip_file:
        for member in zip_file.infolist():
            member_path=extraction_dir/member.filename
            if not member_path.resolve().is_relative_to(extraction_dir.resolve()):
                raise ValueError("unsafe zip file path detected")
        zip_file.extractall(extraction_dir)
    return {
        "repository_id":repository_id,
        "extraction_path":str(extraction_dir)
    }