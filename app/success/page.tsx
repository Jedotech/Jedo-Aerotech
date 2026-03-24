'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Auto-redirect back to marketplace after 10 seconds
    const timer = setTimeout(() => {
      router.push('/marketplace')
    }, 10000)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div style={containerStyle}>
      <div style={{...cardStyle, width: isMobile ? '90%' : '500px'}}>
        
        {/* SUCCESS ICON */}
        <div style={iconContainerStyle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 style={titleStyle}>REQUEST LOGGED</h1>
        
        <p style={messageStyle}>
          Your sourcing inquiry has been transmitted to the <b>Jedo Tech Logistics Desk</b> in Chennai. 
          A technical specialist will verify availability and airworthiness documentation.
        </p>

        <div style={infoBoxStyle}>
          <span style={infoLabelStyle}>NEXT STEPS:</span>
          <ul style={listStyle}>
            <li>Check your WhatsApp for a direct quote.</li>
            <li>Verification of Form 1 / 8130-3 certificates.</li>
            <li>Logistics coordination for hangar delivery.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
          <Link href="/marketplace" style={primaryButtonStyle}>
            RETURN TO MARKETPLACE
          </Link>
          <Link href="/" style={secondaryButtonStyle}>
            BACK TO HOME
          </Link>
        </div>

        <p style={timerStyle}>Auto-redirecting in 10 seconds...</p>
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

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  textAlign: 'center' as const,
};

const iconContainerStyle = {
  width: '80px',
  height: '80px',
  backgroundColor: '#dcfce7',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 25px'
};

const titleStyle = {
  fontSize: '1.8rem',
  fontWeight: '900',
  color: '#001a35',
  margin: '0 0 15px',
  letterSpacing: '1px'
};

const messageStyle = {
  color: '#64748b',
  lineHeight: '1.6',
  fontSize: '1rem',
  marginBottom: '25px'
};

const infoBoxStyle = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'left' as const,
  border: '1px solid #e2e8f0'
};

const infoLabelStyle = {
  fontSize: '0.7rem',
  fontWeight: '900',
  color: '#94a3b8',
  letterSpacing: '1px'
};

const listStyle = {
  paddingLeft: '20px',
  margin: '10px 0 0',
  fontSize: '0.9rem',
  color: '#475569',
  lineHeight: '1.8'
};

const primaryButtonStyle = {
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '16px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '800' as const,
  fontSize: '0.9rem',
  boxShadow: '0 4px 12px rgba(255, 180, 0, 0.3)'
};

const secondaryButtonStyle = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: 'bold' as const
};

const timerStyle = {
  marginTop: '25px',
  fontSize: '0.7rem',
  color: '#94a3b8',
  fontStyle: 'italic'
};