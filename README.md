# AskMyPDF

A modern web app for uploading PDFs and asking questions about their content using AI. Built with FastAPI, React, Supabase (Auth, Storage, pgvector), and Groq LLMs.

---

## Features
- User authentication (email/password)
- Upload PDFs to Supabase Storage
- Extract and chunk PDF text
- Q&A over PDF content using Groq LLM
- Modern chat-like UI
- RAG-ready backend (can be extended with pgvector)

---

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI (Python)
- **Storage & Auth:** Supabase
- **LLM:** Groq API (OpenAI-compatible)
- **PDF Processing:** PyMuPDF
- **Chunking:** LangChain

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AskMyPDF
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

- Create a `.env` file in `backend/` with your Supabase and Groq keys:
  ```env
  SUPABASE_URL=your-supabase-url
  SUPABASE_KEY=your-supabase-service-key
  GROQ_API_KEY=your-groq-api-key
  ```
- Start the backend:
  ```bash
  uvicorn app.main:app --reload
  ```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- The app will be available at `http://localhost:5173`

---

## Usage
1. **Register/Login** with your email and password.
2. **Upload a PDF** using the Upload PDF button in the top bar.
3. **Ask questions** about the uploaded PDF using the chat input at the bottom.
4. **Sign out** using the button in the top right.

---

## Environment Variables
- `SUPABASE_URL` and `SUPABASE_KEY` (service key) for backend access
- `GROQ_API_KEY` for LLM Q&A

---

## Project Structure
```
AskMyPDF/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

---

## Extending to RAG
- Add embeddings and chunk storage to Supabase with pgvector
- Use vector search to retrieve relevant chunks for Q&A

---

## License
MIT 