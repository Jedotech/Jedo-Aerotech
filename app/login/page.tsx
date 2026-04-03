'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// Connect to your production dataset
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

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

    try {
      // AJ: This queries Sanity for a 'fleetUser' document with a matching code
      const user = await client.fetch(
        `*[_type == "fleetUser" && accessCode == $code][0]`,
        { code: accessCode.trim() }
      )

      if (user) {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', user.organization || 'Authorized User')
        router.push('/fleet-health')
      } else {
        // Fallback for your original codes if you haven't moved them to Sanity yet
        if (accessCode.trim().toUpperCase() === 'CFC2026' || accessCode.trim().toUpperCase() === 'JEDO99') {
          localStorage.setItem('fleet_access', 'true')
          router.push('/fleet-health')
        } else {
          setError('Invalid Access Code. Please contact Jedo Logistics.')
        }
      }
    } catch (err) {
      console.error("Login Error:", err)
      setError('Connection error. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        {/* LOGO SECTION */}
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
              type="password" 
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
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
          </button>
        </form>

        {/* SUPPORT FOOTER */}
        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Don&apos;t have a code? <br />
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

// --- STYLES ---
const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#001a35',
  backgroundImage: 'radial-gradient(circle at center, #002d5b 0%, #001a35 100%)',
  padding: '20px'
};

const loginCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '400px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: '800',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '1px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '8px',
  border: '2px solid #f1f5f9',
  fontSize: '1rem',
  outline: 'none',
  color: '#001a35',
  boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
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

const errorStyle: React.CSSProperties = {
  color: '#ef4444',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center'
};