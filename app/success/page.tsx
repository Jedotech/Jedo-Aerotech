'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(15)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mobile Check
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Visual Countdown Timer
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    // Redirect after 15 seconds
    const redirect = setTimeout(() => {
      router.push('/marketplace')
    }, 15000)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(timer)
      clearTimeout(redirect)
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
          Your sourcing inquiry has been transmitted to the <b>Jedo Tech Logistics Desk</b>. 
          A technical specialist will verify availability and airworthiness documentation.
        </p>

        {/* PROFESSIONAL NEXT STEPS BOX */}
        <div style={infoBoxStyle}>
          <span style={infoLabelStyle}>NEXT STEPS:</span>
          <ul style={listStyle}>
            <li>Check your WhatsApp for a direct quote.</li>
            <li>Verification of Form 1 / 8130-3 certificates.</li>
            <li>Logistics coordination for hangar delivery.</li>
          </ul>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
          <Link href="/marketplace" style={primaryButtonStyle}>
            RETURN TO MARKETPLACE
          </Link>
          <Link href="/" style={secondaryButtonStyle}>
            BACK TO HOME
          </Link>
        </div>

        <p style={timerStyle}>Redirecting in {countdown} seconds...</p>
      </div>
    </div>
  )
}

// --- STYLES ---
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
  padding: '50px 40px',
  borderRadius: '24px',
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
  margin: '0 auto 30px'
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
  marginBottom: '30px'
};

const infoBoxStyle = {
  backgroundColor: '#f8fafc',
  padding: '25px',
  borderRadius: '16px',
  textAlign: 'left' as const,
  border: '1px solid #e2e8f0',
  borderLeft: '5px solid #ffb400'
};

const infoLabelStyle = {
  fontSize: '0.7rem',
  fontWeight: '900',
  color: '#94a3b8',
  letterSpacing: '1.5px'
};

const listStyle = {
  paddingLeft: '20px',
  margin: '12px 0 0',
  fontSize: '0.9rem',
  color: '#475569',
  lineHeight: '1.8',
  fontWeight: '500'
};

const primaryButtonStyle = {
  backgroundColor: '#ffb400',
  color: '#001a35',
  padding: '16px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '800' as const,
  fontSize: '1rem',
  boxShadow: '0 8px 15px rgba(255, 180, 0, 0.2)',
  transition: 'transform 0.2s ease'
};

const secondaryButtonStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: 'bold' as const,
  marginTop: '10px'
};

const timerStyle = {
  marginTop: '30px',
  fontSize: '0.75rem',
  color: '#94a3b8',
  fontStyle: 'italic',
  letterSpacing: '0.5px'
};