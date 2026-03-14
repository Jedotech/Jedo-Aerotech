'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd verify a password or send a magic link
    // For now, we store the email to filter the dashboard data
    localStorage.setItem('client_email', email.toLowerCase())
    router.push('/fleet-health')
  }

  return (
    <div style={loginContainer}>
      <form onSubmit={handleLogin} style={loginCard}>
        <img src="/jedo-logo.png" alt="Jedo Logo" style={{ width: '150px', marginBottom: '20px' }} />
        <h2 style={{ color: '#002d5b' }}>Client Fleet Portal</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your registered email to view your tyre health.</p>
        <input 
          type="email" 
          placeholder="email@flightschool.com" 
          required 
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" style={btnStyle}>ACCESS DASHBOARD</button>
      </form>
    </div>
  )
}

const loginContainer = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' };
const loginCard = { padding: '40px', backgroundColor: '#fff', borderRadius: '12px', textAlign: 'center' as const, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px' };
const inputStyle = { width: '100%', padding: '12px', margin: '20px 0', borderRadius: '6px', border: '1px solid #cbd5e1' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#002d5b', color: '#ffb400', border: 'none', borderRadius: '6px', fontWeight: 'bold' as const, cursor: 'pointer' };