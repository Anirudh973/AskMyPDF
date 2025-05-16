import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import React, { useRef } from 'react'
import './App.css'
import logo from './assets/0ff73e1f-2a33-453b-b760-e69e129ac123.png'
import PDFUploader from './components/PDFUploader'
import { supabase } from './lib/supabase'

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

function TopBar({ onUpload, message }: { onUpload: (file: File) => void, message: string }) {
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app-topbar" style={{ justifyContent: 'space-between' }}>
      <div className="app-logo">
        <img src={logo} alt="Logo" style={{ height: 72, width: 72, borderRadius: 12, objectFit: 'cover', background: '#fff' }} />
      </div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="upload-btn"
            style={{ background: '#fff', color: '#232323', fontWeight: 600, fontSize: 16, padding: '10px 24px', borderRadius: 8, border: '1.5px solid #232323', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={handleUploadClick}
          >
            <span style={{ fontSize: 18, marginRight: 4 }}>📄</span> Upload PDF
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {message && (
            <span style={{ color: message.startsWith('Upload successful') ? '#4caf50' : '#ff5252', fontWeight: 500, marginLeft: 8, fontSize: 15, whiteSpace: 'nowrap' }}>{message}</span>
          )}
          <button
            className="upload-btn"
            style={{ background: '#e74c3c', color: '#fff', fontWeight: 600, fontSize: 18, padding: '10px 28px', borderRadius: 8 }}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function MainApp() {
  // State for uploaded PDF (lifted up)
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [pdfPath, setPdfPath] = React.useState('');

  // Handle upload from top bar
  const handleUpload = async (file: File) => {
    setUploading(true);
    setMessage('');
    // Optional: create a unique filename
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('pdfs')
      .upload(filePath, file);
    setUploading(false);
    if (error) {
      setMessage('Upload failed: ' + error.message);
      setPdfPath('');
    } else {
      setMessage('Upload successful! File path: ' + data?.path);
      setPdfPath(filePath);
    }
  };

  return (
    <>
      <TopBar onUpload={handleUpload} message={message} />
      <div className="app-main">
        <div className="app-chat-area">
          <PDFUploader
            uploading={uploading}
            message={''}
            pdfPath={pdfPath}
            setPdfPath={setPdfPath}
            setMessage={setMessage}
          />
      </div>
      </div>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
