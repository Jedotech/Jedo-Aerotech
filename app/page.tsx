import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'YOUR_PROJECT_ID_HERE', // Paste your 8-character ID from sanity.io/manage here
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

// 2. DATA FETCHING FUNCTION
async function getInventory() {
  const query = `*[_type == "part"] | order(_createdAt desc) {
    partNumber,
    aircraftType,
    condition,
    description,
    "imageUrl": partImage.asset->url
  }`
  return await client.fetch(query)
}

export default async function HomePage() {
  const parts = await getInventory();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* MOBILE-RESPONSIVE ENGINE */}
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.5rem !important; }
          .hero-text { font-size: 1.1rem !important; }
          .trust-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .rfq-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>

      {/* WHATSAPP AOG HOTLINE */}
      <a href="https://wa.me/919600038089" target="_blank" rel="noopener noreferrer" style={whatsappButtonStyle}>
        <span style={{ fontSize: '20px' }}>💬</span>
        <span style={{ fontWeight: 'bold' }}>AOG</span>
      </a>

      {/* NAVIGATION BAR */}
      <nav className="nav-container" style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto', cursor: 'pointer' }} />
          </Link>
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '900px', padding: '0 20px' }}>
          <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p className="hero-text" style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and training fleets.
          </p>
          <a href="#rfq" style={heroButtonStyle}>REQUEST QUOTE</a>
        </div>
      </section>

      {/* LIVE INVENTORY TABLE (FROM SANITY) */}
      <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ color: '#002d5b', fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px' }}>Live Inventory</h2>
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #002d5b' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Aircraft Type</th>
                <th style={thStyle}>Condition</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>{part.aircraftType}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}>{part.description}</td>
                </tr>