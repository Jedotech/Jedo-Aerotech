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
      <div style={loginCardStyle}>
        {/* LOGO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '52px', width: 'auto' }} />
          </Link>
          <div style={badgeStyle}>SECURE GATEWAY</div>
          <h2 style={{ color: '#001a35', marginTop: '16px', fontWeight: '900', letterSpacing: '-0.5px', fontSize: '1.4rem' }}>
            FLEET <span style={{ color: '#ffb400' }}>INTEL</span>
          </h2>
        </div>

        {/* LOGIN FORM */}
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

        {/* PROFESSIONAL FOOTER LINKS */}
        <div style={footerStyle}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
            <Link href="/" style={footerNavLink}>HOME</Link>
            <div style={{ width: '1px', backgroundColor: '#e2e8f0', height: '14px' }}></div>
            <a 
              href={`https://wa.me/919600038089?text=${waMessage}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={footerNavLink}
            >
              REQUEST ACCESS
            </a>
          </div>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>
            © 2026 JEDO TECHNOLOGIES PVT. LTD.
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
  padding: '48px 40px',
  borderRadius: '20px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
  marginTop: '15px',
  letterSpacing: '1px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: '900',
  color: '#94a3b8',
  marginBottom: '8px',
  letterSpacing: '1px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '8px',
  border: '2px solid #f1f5f9',
  fontSize: '1.2rem',
  outline: 'none',
  color: '#001a35',
  boxSizing: 'border-box',
  textAlign: 'center',
  letterSpacing: '4px',
  backgroundColor: '#f8fafc'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '16px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: '900',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  boxShadow: '0 8px 16px rgba(255, 180, 0, 0.2)',
  letterSpacing: '0.5px'
};

const errorContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff1f2',
  color: '#e11d48',
  padding: '10px',
  borderRadius: '6px',
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

const footerNavLink: React.CSSProperties = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '0.7rem',
  fontWeight: '800',
  letterSpacing: '0.5px'
};