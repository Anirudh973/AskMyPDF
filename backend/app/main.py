from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from .routes import pdf
from .routes import qa

app = FastAPI(
    title="AskMyPDF API",
    description="API for PDF Q&A application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router)
app.include_router(qa.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AskMyPDF API"} 