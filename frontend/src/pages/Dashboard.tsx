import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Dashboard</h2>
        <button onClick={handleSignOut} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>
          Sign Out
        </button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <span>Welcome, {user?.email}</span>
      </div>
      {/* PDF upload and Q&A components will be added here */}
    </div>
  )
} 