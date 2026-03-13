import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

// 2. DATA FETCHING (Optimized for Tyre Sourcing)
async function getInventory() {
  const query = `*[_type == "part"] | order(_createdAt desc) [0...5] {
    partNumber,
    aircraftType,
    condition,
    description,
    quantity,
    warehouse
  }`
  try {
    return await client.fetch(query)
  } catch (e) {
    console.error("Fetch error:", e)
    return []
  }
}

export default async function HomePage() {
  const parts = await getInventory();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.8rem !important; }
          .desktop-nav { display: none !important; }
          .hero-btn-container { flex-direction: column; gap: 10px; }
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
          <Link href="/inventory" style={navLinkStyle}>MARKETPLACE</Link>
          <a href="#rfq" style={quoteButtonStyle}>REQUEST SOURCING</a>
        </div>
      </nav>

      {/* HERO SECTION - GLOBAL BROKERAGE FOCUS */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2, marginBottom: '15vh' }}>
          <h1 className="hero-title" style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', maxWidth: '850px', margin: '0 auto 30px', opacity: 0.95 }}>
            Specialized brokerage for Cessna, Piper & Beechcraft. We source, verify, and deliver certified tyres to your hangar.
          </p>
          
          <div className="hero-btn-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/inventory" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="/tools/tyre-predict" style={secondaryButtonStyle}>Tyre Life Predictor</Link>
          </div>
        </div>
      </section>

      {/* BROKERAGE VALUE PROPOSITION */}
      <section style={{ padding: '60px 20px', backgroundColor: '#002d5b', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          <div style={uspStyle}><h3>Global Network</h3><p>Access to USA & Singapore hubs</p></div>
          <div style={uspStyle}><h3>Certified Only</h3><p>FAA 8130-3 / EASA Form 1 verified</p></div>
          <div style={uspStyle}><h3>AOG Support</h3><p>Priority sourcing for grounded aircraft</p></div>
        </div>
      </section>

      {/* SOURCING PREVIEW */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#002d5b', fontWeight: '800', fontSize: '2.2rem' }}>Global Availability Preview</h2>
          <Link href="/inventory" style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'none', borderBottom: '3px solid #ffb400' }}>
            Full Tyre Marketplace →
          </Link>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: '15px', border: '2px solid #002d5b', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part / Size</th>
                <th style={thStyle}>Compatible Fleet</th>
                <th style={thStyle}>Sourcing Status</th>
                <th style={thStyle}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>{part.aircraftType || 'Cessna 172'}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 'bold', color: part.quantity > 0 ? '#16a34a' : '#64748b' }}>
                      {part.quantity > 0 ? 'Ready for Dispatch' : 'Available to Source'}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      Est: {part.warehouse === 'Chennai' ? '24h' : '7-10 Days'}
                    </div>
                  </td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center' }}>Syncing Global Inventory Hubs...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RFQ SOURCING FORM */}
      <section id="rfq" style={{ padding: '100px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: '#002d5b', fontSize: '2.8rem', fontWeight: '800' }}>Global Sourcing Request</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Tell us what you need; we'll handle the rest.</p>
          </div>
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <input type="text" name="part" placeholder="Tyre Size or Part Number *" required style={inputStyle} />
            <input type="email" name="email" placeholder="Contact Email *" required style={inputStyle} />
            <textarea name="message" placeholder="Aircraft Model & Quantity needed..." rows={5} style={inputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>INITIATE SOURCING</button>
          </form>
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Premier Aviation Tyre Brokerage
        </p>
      </footer>
    </div>
  )
}

// STYLE OBJECTS
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };

const heroSectionStyle = { 
  width: '100%',
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundImage: 'linear-gradient(rgba(0,45,91,0.4), rgba(0,45,91,0.4)), url("/hero-aircraft.png")', 
  backgroundSize: 'cover', 
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
  backgroundColor: '#002d5b', 
  color: 'white', 
  textAlign: 'center' as const
};

const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };
const uspStyle = { maxWidth: '250px' };
const thStyle = { padding: '20px', fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px' };
const tdStyle = { padding: '20px', color: '#002d5b', fontSize: '1rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' as const, color: '#002d5b' };
const inputStyle = { padding: '18px', borderRadius: '10px', border: '2px solid #cbd5e1', width: '100%', fontSize: '1rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };