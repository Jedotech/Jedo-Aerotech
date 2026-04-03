'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

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
      const user = await client.fetch(
        `*[_type == "fleetUser" && accessCode == $code][0]`,
        { code: accessCode.trim() }
      )

      if (user) {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', user.organization || 'Authorized User')
        router.push('/fleet-health')
      } else {
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
      {/* 1. TOP-LEFT HOME LINK (OUTSIDE) */}
      <div style={externalHomeNav}>
        <Link href="/" style={externalHomeLink}>← HOME</Link>
      </div>

      <div style={layoutWrapper}>
        {/* 2. LOGO SECTION (LEFT SIDE) */}
        <div style={logoSidebar}>
          <img src="/jedo-logo.png" alt="Jedo" style={{ height: '70px', marginBottom: '20px' }} />
          <div style={sidebarText}>
            <h1 style={{ color: '#ffb400', fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>JEDO TECH</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '600', marginTop: '5px' }}>
              AVIATION FLEET INTELLIGENCE
            </p>
          </div>
        </div>

        {/* 3. LOGIN CARD (RIGHT SIDE) */}
        <div style={loginCardStyle}>
          <div style={badgeStyle}>SECURE ACCESS</div>
          <h2 style={{ color: '#001a35', margin: '15px 0 25px', fontWeight: '900' }}>OPERATOR LOGIN</h2>
          
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

            {error && <div style={errorContainerStyle}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'VERIFYING...' : 'AUTHORIZE SESSION'}
            </button>
          </form>

          <div style={footerStyle}>
             <a 
              href={`https://wa.me/919600038089?text=${waMessage}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={whatsappLink}
            >
              REQUEST ACCESS VIA SOURCING DESK
            </a>
            <p style={copyright}>© 2026 JEDO TECHNOLOGIES PVT. LTD.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- UPDATED STYLES FOR SPLIT LAYOUT ---
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#001a35',
  backgroundImage: 'radial-gradient(circle at center, #002d5b 0%, #001a35 100%)',
  padding: '40px'
};

const externalHomeNav: React.CSSProperties = {
  position: 'absolute',
  top: '40px',
  left: '40px'
};

const externalHomeLink: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '0.75rem',
  fontWeight: '900',
  letterSpacing: '1px',
  opacity: 0.6,
  padding: '8px 16px',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px'
};

const layoutWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '80px', // Space between logo and card
  maxWidth: '1000px',
  width: '100%',
  justifyContent: 'center',
  flexWrap: 'wrap' // Mobile friendly
};

const logoSidebar: React.CSSProperties = {
  textAlign: 'center',
  minWidth: '250px'
};

const sidebarText: React.CSSProperties = {
  borderTop: '2px solid #ffb400',
  paddingTop: '15px',
  marginTop: '10px'
};

const loginCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '50px 40px',
  borderRadius: '24px',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '400px'
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  fontSize: '0.6rem',
  fontWeight: '900',
  padding: '4px 10px',
  borderRadius: '4px',
  letterSpacing: '1px'
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: '900',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '1px'
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
  boxShadow: '0 8px 16px rgba(255, 180, 0, 0.2)'
};

const errorContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff1f2',
  color: '#e11d48',
  padding: '10px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: '700',
  marginBottom: '20px',
  textAlign: 'center'
};

const footerStyle: React.CSSProperties = {
  marginTop: '30px',
  textAlign: 'center',
  borderTop: '1px solid #f1f5f9',
  paddingTop: '20px'
};

const whatsappLink: React.CSSProperties = {
  color: '#ffb400',
  textDecoration: 'none',
  fontSize: '0.7rem',
  fontWeight: '800',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '10px'
};

const copyright: React.CSSProperties = {
  fontSize: '0.6rem',
  color: '#94a3b8',
  fontWeight: '600'
};