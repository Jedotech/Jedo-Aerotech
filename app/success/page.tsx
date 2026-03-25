'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconCircle}>✓</div>
        <h1 style={titleStyle}>REQUEST TRANSMITTED</h1>
        <p style={textStyle}>
          Your procurement request has been logged in our Chennai Hub. 
          A logistics officer will contact you shortly with technical verification and a quote.
        </p>
        <Link href="/marketplace" style={btnStyle}>
          RETURN TO INVENTORY
        </Link>
      </div>
      <footer style={footerStyle}>© 2026 Jedo Technologies Pvt. Ltd. | DGCA Compliance</footer>
    </div>
  )
}

// STYLES
const containerStyle = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#001a35', color: 'white', fontFamily: 'Inter, sans-serif' };
const cardStyle = { textAlign: 'center' as const, maxWidth: '500px', padding: '40px' };
const iconCircle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' };
const titleStyle = { fontSize: '2rem', fontWeight: '900', color: '#ffb400', marginBottom: '20px', letterSpacing: '1px' };
const textStyle = { fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '40px' };
const btnStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '15px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const footerStyle = { position: 'absolute' as const, bottom: '40px', fontSize: '0.7rem', opacity: 0.3 };