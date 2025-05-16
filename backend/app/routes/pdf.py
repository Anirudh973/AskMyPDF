from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from ..auth.auth import get_current_user, supabase
import fitz  # PyMuPDF
import uuid

router = APIRouter(prefix="/pdf", tags=["PDF Upload"])

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), user=Depends(get_current_user)):
    if file.content_type != 'application/pdf':
        return JSONResponse(status_code=400, content={"error": "Only PDF files are allowed."})
    # Read file contents
    contents = await file.read()
    # Extract text using PyMuPDF
    text = ""
    with fitz.open(stream=contents, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    # Generate a unique filename to avoid collisions
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    # Upload to Supabase Storage
    storage_response = supabase.storage.from_("pdfs").upload(unique_filename, contents)
    if storage_response.get('error'):
        return JSONResponse(status_code=500, content={"error": "Failed to upload PDF to storage."})
    storage_path = f"pdfs/{unique_filename}"
    return {
        "filename": file.filename,
        "storage_path": storage_path,
        "extracted_text": text[:1000]  # Return first 1000 chars for brevity
    } 