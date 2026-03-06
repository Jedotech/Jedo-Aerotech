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
  const query = `*[_type == "part"] | order(_createdAt desc) [0...5] {
    partNumber,
    aircraftType,
    condition,
    description,
    quantity
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

      {/* HERO SECTION - EDGE TO EDGE */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 className="hero-title" style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '10px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}>
            GLOBAL PARTS. <br />
            <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', fontWeight: '600', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
            Chennai's premier sourcing agency for Cessna and Piper training fleets.
          </p>
        </div>
      </section>

      {/* FEATURED INVENTORY PREVIEW */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#002d5b', fontWeight: '800', fontSize: '2.2rem' }}>Live Inventory Preview</h2>
          <Link href="/inventory" style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #ffb400' }}>
            Browse Full Catalog →
          </Link>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: '15px', border: '2px solid #002d5b', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Availability</th>
                <th style={thStyle}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>{part.aircraftType || 'Cessna 172'}</td>
                  <td style={tdStyle}>
                    <span style={{ color: part.quantity > 0 ? '#16a34a' : '#64748b', fontWeight: 'bold' }}>
                      {part.quantity > 0 ? `${part.quantity} In Stock` : '7 Day Lead Time'}
                    </span>
                  </td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Syncing with Chennai Hub...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RFQ FORM SECTION */}
      <section id="rfq" style={{ padding: '100px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: '#002d5b', fontSize: '2.8rem', fontWeight: '800' }}>Request a Quote</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Expert sourcing for AOG and scheduled maintenance.</p>
          </div>
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <input type="text" name="part" placeholder="Part Number(s) *" required style={inputStyle} />
            <input type="email" name="email" placeholder="Official Email Address *" required style={inputStyle} />
            <textarea name="message" placeholder="Aircraft Serial Number or specific requirements..." rows={5} style={inputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND RFQ</button>
          </form>
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src="/jedo-logo.png" alt="Jedo Tech" style={{ height: '40px', opacity: 0.8, filter: 'brightness(0) invert(1)' }} />
        </div>
        <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Aviation Supply Chain Specialists
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
  minHeight: '85vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundImage: 'linear-gradient(rgba(0,45,91,0.45), rgba(0,45,91,0.45)), url("/hero-aircraft.png")', 
  backgroundSize: 'cover', // Eliminates left/right gaps
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center 30%', // Adjusted to keep the cockpit/wings visible
  backgroundColor: '#002d5b', 
  color: 'white', 
  textAlign: 'center' as const,
  margin: 0
};

const thStyle = { padding: '20px', fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px' };
const tdStyle = { padding: '20px', color: '#002d5b', fontSize: '1rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' as const, color: '#002d5b' };
const inputStyle = { padding: '18px', borderRadius: '10px', border: '2px solid #cbd5e1', width: '100%', fontSize: '1rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s' };