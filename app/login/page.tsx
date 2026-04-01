'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple security logic for initial setup
    // You can later expand this to check against your 'serviceClients' in Sanity
    if (accessCode.trim().toUpperCase() === 'CFC2026' || accessCode.trim().toUpperCase() === 'JEDO99') {
      // Simulate session storage
      localStorage.setItem('fleet_access', 'true')
      
      // UPDATED: Points to your actual folder /app/fleet-health
      router.push('/fleet-health')
    } else {
      setError('Invalid Access Code. Please contact Jedo Logistics.')
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '50px', width: 'auto' }} />
          </Link>
          <h2 style={{ color: '#001a35', marginTop: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            FLEET INTELLIGENCE LOGIN
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your authorized access code</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>ACCESS CODE</label>
            <input 
              type="text" 
              placeholder="e.g. CFCXXXX" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'VERIFYING...' : 'AUTHORIZE ACCESS'}
          </button>
        </form>

        {/* SUPPORT FOOTER */}
        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Don't have a code? <br />
            <a href="https://wa.me/919600038089" style={{ color: '#ffb400', fontWeight: 'bold', textDecoration: 'none' }}>
              Contact Sourcing Desk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// STYLES
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#001a35',
  backgroundImage: 'radial-gradient(circle at center, #002d5b 0%, #001a35 100%)',
  padding: '20px'
};

const loginCardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '400px'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: '800',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '1px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '8px',
  border: '2px solid #f1f5f9',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  color: '#001a35',
  boxSizing: 'border-box' as const
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '16px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: '800',
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
  boxShadow: '0 4px 12px rgba(255, 180, 0, 0.3)'
};

const errorStyle = {
  color: '#ef4444',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center' as const
};