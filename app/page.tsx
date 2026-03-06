import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', 
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
    description
  }`
  try {
    return await client.fetch(query)
  } catch (e) {
    return []
  }
}

export default async function HomePage() {
  const parts = await getInventory();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.5rem !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>

      {/* NAVIGATION BAR */}
      <nav className="nav-container" style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto' }} />
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
          <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>
            Chennai's premier sourcing agency for Cessna and Piper fleets.
          </p>
        </div>
      </section>

      {/* LIVE INVENTORY TABLE */}
      <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ color: '#002d5b', fontWeight: '800', marginBottom: '30px' }}>Live Inventory</h2>
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #002d5b' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Type</th>
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
              )) : (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center' }}>No parts listed.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RFQ FORM */}
      <section id="rfq" style={{ padding: '100px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#002d5b', marginBottom: '40px' }}>Request Quote</h2>
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" name="part" placeholder="Part Number *" required style={boldInputStyle} />
            <input type="email" name="email" placeholder="Email *" required style={boldInputStyle} />
            <textarea name="message" placeholder="Details..." rows={4} style={boldInputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND REQUEST</button>
          </form>
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '40px', textAlign: 'center' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd.</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const heroSectionStyle = { height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.7), rgba(0,45,91,0.7)), url("/hero-aircraft.png")', backgroundSize: 'cover', color: 'white', textAlign: 'center' as const };
const thStyle = { padding: '15px' };
const tdStyle = { padding: '15px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' as const };
const boldInputStyle = { padding: '15px', borderRadius: '6px', border: '2px solid #002d5b', width: '100%' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '15px', borderRadius: '6px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer' };