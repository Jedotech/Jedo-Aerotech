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

    const code = accessCode.trim().toUpperCase()

    try {
      // 1. Check for the new Fly High School static credential
      if (code === 'AJ747') {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', 'Fly High School')
        router.push('/fleet-health')
        return
      }

      // 2. Check for the general master keys (Legacy)
      if (code === 'CFC2026' || code === 'JEDO99') {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', 'Authorized Operator')
        router.push('/fleet-health')
        return
      }

      // 3. Check for dynamic users in Sanity database
      const user = await client.fetch(
        `*[_type == "fleetUser" && accessCode == $code][0]`,
        { code: accessCode.trim() }
      )

      if (user) {
        localStorage.setItem('fleet_access', 'true')
        localStorage.setItem('fleet_user_org', user.organization || 'Authorized User')
        router.push('/fleet-health')
      } else {
        setError('Invalid Access Code. Please contact Jedo Logistics.')
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
      
      {/* 1. TOP NAVIGATION */}
      <nav style={topNavStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo Technologies" style={topLogoStyle} />
        </Link>
        <Link href="/" style={topHomeLinkStyle}>
          HOME
        </Link>
      </nav>

      {/* 2. CENTERED PREMIUM LOGIN CARD */}
      <div style={centeredCardWrapper}>
        <div style={loginCardStyle}>
          
          <div style={cardHeaderStyle}>
            <h2 style={cardTitleStyle}>
              FLEET <span style={{ color: '#ffb400' }}>INTEL</span> LOGIN
            </h2>
            <div style={statusBadgeStyle}>SECURE OPERATOR GATEWAY</div>
            <div style={titleUnderline}></div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>AUTHORIZED ACCESS CODE</label>
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
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE SESSION'}
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
              Request Access via Sourcing Desk
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
  height: '100vh',
  width: '100vw',
  backgroundColor: '#001a35',
  backgroundImage: 'radial-gradient(circle at top right, #002d5b 0%, #001a35 100%)',
  overflow: 'hidden',
  position: 'relative'
};

const topNavStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  width: '100%',
  boxSizing: 'border-box',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10
};

const topLogoStyle: React.CSSProperties = {
  height: '38px',
  width: 'auto',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
};

const topHomeLinkStyle: React.CSSProperties = {
  color: '#ffb400',
  textDecoration: 'none',
  fontSize: '0.65rem',
  fontWeight: '900',
  letterSpacing: '1.5px',
  padding: '8px 20px',
  border: '1px solid rgba(255,180,0,0.4)',
  borderRadius: '6px',
  backgroundColor: 'rgba(255,180,0,0.05)'
};

const centeredCardWrapper: React.CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 20px 20px',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
};

const loginCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '40px 45px',
  borderRadius: '28px',
  boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.6)',
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center',
};

const cardHeaderStyle: React.CSSProperties = {
  marginBottom: '25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const cardTitleStyle: React.CSSProperties = {
  color: '#001a35',
  margin: '0 0 5px 0',
  fontWeight: '900',
  fontSize: '1.4rem',
  letterSpacing: '-0.5px'
};

const titleUnderline: React.CSSProperties = {
  width: '35px',
  height: '3px',
  backgroundColor: '#ffb400',
  borderRadius: '2px',
  marginTop: '8px'
};

const statusBadgeStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.6rem',
  fontWeight: '800',
  letterSpacing: '1.2px',
  textTransform: 'uppercase'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6rem',
  fontWeight: '900',
  color: '#64748b',
  marginBottom: '8px',
  letterSpacing: '1px',
  textAlign: 'left'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  fontSize: '1.2rem',
  outline: 'none',
  color: '#001a35',
  boxSizing: 'border-box',
  textAlign: 'center',
  letterSpacing: '6px',
  backgroundColor: '#f8fafc',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '16px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: '900',
  boxShadow: '0 8px 16px -4px rgba(255, 180, 0, 0.4)',
  letterSpacing: '0.5px'
};

const errorContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff1f2',
  color: '#e11d48',
  padding: '8px',
  borderRadius: '10px',
  fontSize: '0.7rem',
  fontWeight: '700',
  marginBottom: '15px',
  textAlign: 'center',
  border: '1px solid #ffe4e6'
};

const footerStyle: React.CSSProperties = {
  marginTop: '25px',
  textAlign: 'center',
  borderTop: '1px solid #f1f5f9',
  paddingTop: '20px'
};

const whatsappLinkStyle: React.CSSProperties = {
  color: '#001a35',
  textDecoration: 'none',
  fontSize: '0.7rem',
  fontWeight: '800',
  letterSpacing: '0.3px',
  display: 'block',
  marginBottom: '8px',
};

const copyrightStyle: React.CSSProperties = {
  fontSize: '0.55rem',
  color: '#cbd5e1',
  fontWeight: '700',
  letterSpacing: '0.5px'
};