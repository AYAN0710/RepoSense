from fastapi import APIRouter,File,UploadFile,HTTPException
from app.services.repository_service import save_repository,extract_repository
from app.ingestion.file_scanner import scan_repository
from app.ingestion.code_loader import load_code_files
from app.chunking.code_chunker import chunk_code
from app.embeddings.embedding_service import embed_documents
from app.vectorstore.qdrant_service import create_collection,store_chunks

router=APIRouter(prefix='/repositories',tags=['Repositories'])

@router.post('/upload')
async def upload_repository(file:UploadFile=File(...)):
    is_zip_extension=file.filename.lower().endswith('.zip')
    is_zip_mime=file.content_type in ['application/zip','application/x-zip-compressed']
    if not (is_zip_extension or is_zip_mime):
        raise HTTPException(status_code=400,detail='only .zip files allowed.')
    result=save_repository(file)
    extracted_result=extract_repository(
        result['saved_path'],result['repository_id']
    )
    files=scan_repository(extracted_result['extraction_path'])
    documents=load_code_files(
        files,
        result["repository_id"]
    )
    chunks=chunk_code(documents)
    vector_size=384
    create_collection(vector_size)
    qdrant_result=store_chunks(chunks)
    return {
        'repository_id':result["repository_id"],
        'filename':result['filename'],
        'extraction_path':extracted_result['extraction_path'],
        'total_files':len(files),
        'total_documents':len(documents),
        'total_chunks':len(chunks),
        # 'chunks':chunks,
        # 'files':files
        'vectors_stored':qdrant_result['vectors_stored']
    }