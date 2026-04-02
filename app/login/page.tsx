'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const waMessage = encodeURIComponent(
    "Hello Jedo Logistics, I would like to request an Access Code for the Fleet Intelligence System.\n\nOrganization Name: \nContact Name: "
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (accessCode.trim().toUpperCase() === 'CFC2026' || accessCode.trim().toUpperCase() === 'JEDO99') {
      localStorage.setItem('fleet_access', 'true')
      router.push('/fleet-health')
    } else {
      setError('Invalid Access Code. Please contact Jedo Logistics.')
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '50px', width: 'auto' }} />
          </Link>
          <h2 style={{ color: '#001a35', marginTop: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            FLEET INTELLIGENCE LOGIN
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your authorized access code</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>ACCESS CODE</label>
            <input 
              type="password" // CHANGED: This masks the input with asterisks
              placeholder="••••••••" 
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

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Don't have a code? <br />
            {/* UPDATED: Opens in new tab with custom message */}
            <a 
              href={`https://wa.me/919600038089?text=${waMessage}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#ffb400', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Contact Sourcing Desk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ... Styles remain the same