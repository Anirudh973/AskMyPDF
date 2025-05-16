import React, { useState } from 'react'

interface PDFUploaderProps {
  uploading: boolean;
  message: string;
  pdfPath: string;
  setPdfPath: (path: string) => void;
  setMessage: (msg: string) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ uploading, message, pdfPath }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [error, setError] = useState('')

  // Q&A submit handler
  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnswer('')
    setError('')
    setLoadingAnswer(true)
    try {
      if (!pdfPath) {
        setError('Please upload a PDF first.')
        setLoadingAnswer(false)
        return
      }
      const response = await fetch('http://127.0.0.1:8000/qa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdf_path: pdfPath,
          question: question
        })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Error from backend')
      }
      const data = await response.json()
      setAnswer(data.answer)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingAnswer(false)
    }
  }

  return (
    <>
      <div className="app-chat-upload">
        {/* Upload button is now in the top bar */}
        {uploading && <span style={{ marginLeft: 12 }}>Uploading...</span>}
        {message && <div style={{ marginTop: 12, color: message.startsWith('Upload successful') ? '#4caf50' : '#ff5252' }}>{message}</div>}
        {pdfPath && <div style={{ marginTop: 8, color: '#aaa', fontSize: 14 }}>PDF ready for Q&amp;A</div>}
      </div>

      {/* Q&A Input Bar */}
      <div className="app-chat-input-bar">
        <form onSubmit={handleAsk} className="app-chat-input-form">
          <input
            type="text"
            className="app-chat-input"
            placeholder="Type your question about the PDF..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={!pdfPath || loadingAnswer}
          />
          <button type="submit" className="app-chat-ask-btn" disabled={!pdfPath || loadingAnswer}>Ask</button>
        </form>
      </div>

      {/* Answer Area */}
      <div style={{ width: '100%' }}>
        {loadingAnswer && <div style={{ color: '#aaa', marginTop: 24 }}>Getting answer...</div>}
        {error && <div style={{ color: '#ff5252', marginTop: 24 }}>{error}</div>}
        {answer && (
          <div style={{ marginTop: 32, marginLeft: 32, color: '#fff', fontSize: '1.1rem', textAlign: 'left' }}>
            {answer}
          </div>
        )}
      </div>
    </>
  )
}

export default PDFUploader 