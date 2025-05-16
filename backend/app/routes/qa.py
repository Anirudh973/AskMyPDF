from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.config import get_settings
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
import requests
from app.auth.auth import supabase

router = APIRouter(prefix="/qa", tags=["Q&A"])

class AskRequest(BaseModel):
    pdf_path: str  # Path in Supabase Storage (e.g., 'pdfs/filename.pdf')
    question: str

@router.post("/ask")
async def ask_pdf(request: AskRequest):
    # 1. Download PDF from Supabase Storage as bytes
    try:
        # Remove any leading slashes from pdf_path
        storage_path = request.pdf_path.lstrip("/")
        response = supabase.storage.from_("pdfs").download(storage_path)
        if hasattr(response, 'read'):  # If response is a file-like object
            pdf_bytes = response.read()
        else:
            pdf_bytes = response
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download PDF from Supabase Storage: {e}")

    # 2. Extract text from PDF bytes
    try:
        text = ""
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to open PDF: {e}")

    # 3. Chunk text with LangChain
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    # 4. (Placeholder) Use all chunks as context. In production, use retrieval.
    context = "\n".join(chunks[:5])  # Use first 5 chunks for now

    # 5. Call Groq API
    settings = get_settings()
    groq_api_key = settings.groq_api_key
    groq_url = "https://api.groq.com/openai/v1/chat/completions"  # Corrected endpoint
    headers = {"Authorization": f"Bearer {groq_api_key}", "Content-Type": "application/json"}
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant for answering questions about PDF documents."},
            {"role": "user", "content": f"Context: {context}\n\nQuestion: {request.question}"}
        ],
        "temperature": 0.2,
        "max_tokens": 512
    }
    try:
        response = requests.post(groq_url, headers=headers, json=payload)
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        try:
            error_detail = response.text
        except Exception:
            error_detail = str(e)
        raise HTTPException(status_code=500, detail=f"Groq API error: {e} | {error_detail}")

    return {"answer": answer} 