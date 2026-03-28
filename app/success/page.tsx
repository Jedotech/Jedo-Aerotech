'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div style={containerStyle}>
      {/* HEADER SECTION - Anchors the logo properly */}
      <header style={headerStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '40px', width: 'auto' }} />
        </Link>
      </header>

      {/* MAIN CONTENT CARD */}
      <main style={mainContentStyle}>
        <div style={cardStyle}>
          <div style={iconCircle}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 style={titleStyle}>REQUEST TRANSMITTED</h1>
          <div style={statusBadge}>STATUS: LOGISTICS DESK NOTIFIED</div>
          <p style={textStyle}>
            Your procurement request has been logged in our Chennai Hub. 
            A logistics officer will contact you shortly with technical verification and a quote.
          </p>
          <div style={buttonGroup}>
            <Link href="/marketplace" style={btnStyle}>
              RETURN TO INVENTORY
            </Link>
            <Link href="/" style={secondaryBtnStyle}>
              BACK TO HOME
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        © 2026 Jedo Technologies Pvt. Ltd. | DGCA, FAA & EASA Compliance
      </footer>
    </div>
  )
}

// STYLES
const containerStyle = { 
  display: 'flex', 
  flexDirection: 'column' as const, 
  minHeight: '100vh', 
  backgroundColor: '#001a35', 
  // Adds a professional "cockpit" depth effect
  backgroundImage: 'radial-gradient(circle at center, #002a54 0%, #001a35 100%)',
  color: 'white', 
  fontFamily: 'Inter, system-ui, sans-serif'
};

const headerStyle = {
  width: '100%',
  padding: '30px 60px',
  display: 'flex',
  justifyContent: 'center',
  borderBottom: '1px solid rgba(255,180,0,0.1)' // Very subtle line to anchor the logo
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const cardStyle = { 
  textAlign: 'center' as const, 
  maxWidth: '550px', 
  padding: '50px 40px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
};

const iconCircle = { 
  width: '80px', 
  height: '80px', 
  borderRadius: '50%', 
  backgroundColor: '#10b981', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  margin: '0 auto 25px',
  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
};

const titleStyle = { 
  fontSize: '2.2rem', 
  fontWeight: '900', 
  color: '#ffb400', 
  marginBottom: '10px', 
  letterSpacing: '1px' 
};

const statusBadge = {
  display: 'inline-block',
  padding: '6px 12px',
  backgroundColor: 'rgba(255, 180, 0, 0.1)',
  color: '#ffb400',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  marginBottom: '25px',
  letterSpacing: '0.5px'
};

const textStyle = { 
  fontSize: '1.1rem', 
  color: 'rgba(255,255,255,0.7)', 
  lineHeight: '1.6', 
  marginBottom: '40px' 
};

const buttonGroup = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'center'
};

const btnStyle = { 
  backgroundColor: '#ffb400', 
  color: '#001a35', 
  padding: '16px 30px', 
  borderRadius: '4px', 
  textDecoration: 'none', 
  fontWeight: 'bold' as const, 
  fontSize: '0.9rem',
  transition: '0.2s'
};

const secondaryBtnStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  padding: '16px 30px',
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: 'bold' as const,
  fontSize: '0.9rem',
  border: '1px solid rgba(255,255,255,0.2)'
};

const footerStyle = { 
  padding: '40px 20px', 
  fontSize: '0.75rem', 
  opacity: 0.4,
  textAlign: 'center' as const,
  borderTop: '1px solid rgba(255,255,255,0.05)'
};