'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// Vercel-optimized Sanity connection
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
      // Queries Sanity for a 'fleetUser' document with a matching unique code
      const user = await client.fetch(
        `*[_type == "fleetUser" && accessCode == $code][0]`,
        { code: accessCode.trim() }
      )

      if (user) {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', user.organization || 'Authorized User')
        router.push('/fleet-health')
      } else {
        // Fallback for original hardcoded codes
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
      
      {/* 1. TOP NAVIGATION ROW */}
      <nav style={topNavStyle}>
        {/* Logo in top-left (same size as HomePage) */}
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo Technologies" style={topLogoStyle} />
        </Link>
        
        {/* Golden Home link in top-right (no arrow) */}
        <Link href="/" style={topHomeLinkStyle}>
          HOME
        </Link>
      </nav>

      {/* 2. CENTERED LOGIN CARD */}
      <div style={centeredCardWrapper}>
        <div style={loginCardStyle}>
          
          <div style={cardHeaderStyle}>
            {/* The exact title requested */}
            <h2 style={cardTitleStyle}>FLEET INTEL LOGIN</h2>
            <div style={statusBadgeStyle}>SECURE OPERATOR GATEWAY</div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
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

            {error && <div style={errorContainerStyle}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'VERIFYING...' : 'AUTHORIZE ACCESS'}
            </button>
          </form>

          {/* SOURCING DESK LINK */}
          <div style={footerStyle}>
             <a 
              href={`https://wa.me/919600038089?text=${waMessage}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={whatsappLinkStyle}
            >
              Contact Sourcing Desk
            </a>
            <p style={copyrightStyle}>© 2026 JEDO TECHNOLOGIES PVT. LTD.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- PROFESSIONAL STYLING ---
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#001a35',
  backgroundImage: 'radial-gradient(circle at center, #002d5b 0%, #001a35 100%)',
};

const topNavStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 50px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10
};

const topLogoStyle: React.CSSProperties = {
    height: '40px', // Standardized for top bar navigation
    width: 'auto',
};

const topHomeLinkStyle: React.CSSProperties = {
    color: '#ffb400', // Golden color
    textDecoration: 'none',
    fontSize: '0.75rem',
    fontWeight: '900',
    letterSpacing: '1px',
    padding: '8px 16px',
    border: '1px solid rgba(255,180,0,0.3)',
    borderRadius: '4px',
};

const centeredCardWrapper: React.CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 20px 40px', // Top padding clears the absolute nav bar
  width: '100%',
  boxSizing: 'border-box',
};

const loginCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '50px 40px',
  borderRadius: '24px',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center'
};

const cardHeaderStyle: React.CSSProperties = {
    marginBottom: '32px'
};

const cardTitleStyle: React.CSSProperties = {
    color: '#001a35',
    margin: '0 0 10px 0',
    fontWeight: '900',
    letterSpacing: '-0.5px'
};

const statusBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  fontSize: '0.6rem',
  fontWeight: '900',
  padding: '4px 10px',
  borderRadius: '4px',
  letterSpacing: '1px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: '900',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '1px',
  textAlign: 'left'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  border: '2px solid #f1f5f9',
  fontSize: '1.2rem',
  outline: 'none',
  color: '#001a35',
  boxSizing: 'border-box',
  textAlign: 'center',
  letterSpacing: '5px',
  backgroundColor: '#f8fafc'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '18px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: '900',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  boxShadow: '0 10px 15px -3px rgba(255, 180, 0, 0.2)'
};

const errorContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff1f2',
  color: '#e11d48',
  padding: '10px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: '700',
  marginBottom: '20px',
  textAlign: 'center',
  border: '1px solid #ffe4e6'
};

const footerStyle: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
  borderTop: '1px solid #f1f5f9',
  paddingTop: '24px'
};

const whatsappLinkStyle: React.CSSProperties = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '0.7rem',
  fontWeight: '800',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '10px'
};

const copyrightStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  color: '#94a3b8',
  fontWeight: '600'
};