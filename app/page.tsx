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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.5rem !important; }
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

      {/* HERO SECTION - FIXED TO SHOW FULL AIRCRAFT */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1000px', padding: '0 20px', zIndex: 2, marginTop: '-100px' }}>
          <h1 className="hero-title" style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px', lineHeight: '1.1' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.3rem', fontWeight: '500', maxWidth: '750px', margin: '0 auto', opacity: 0.9 }}>
            Chennai's premier sourcing agency for Cessna and Piper training fleets.
          </p>
        </div>
      </section>

      {/* FEATURED INVENTORY PREVIEW */}
      <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#002d5b', fontWeight: '800', fontSize: '2rem' }}>Featured Inventory</h2>
          <Link href="/inventory" style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'underline' }}>View All Parts →</Link>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #002d5b' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #eee' }}>
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
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center' }}>Updating Live Feed...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RFQ FORM */}
      <section id="rfq" style={{ padding: '100px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '800' }}>Request a Quote</h2>
            <p style={{ color: '#64748b' }}>Fast response for AOG and scheduled maintenance.</p>
          </div>
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" name="part" placeholder="Part Number(s) *" required style={inputStyle} />
            <input type="email" name="email" placeholder="Your Email Address *" required style={inputStyle} />
            <textarea name="message" placeholder="Aircraft S/N or specific requirements..." rows={4} style={inputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND RFQ</button>
          </form>
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence in Chennai
        </p>
      </footer>
    </div>
  )
}

// STYLE OBJECTS
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 22px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };

const heroSectionStyle = { 
  height: '85vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundImage: 'linear-gradient(rgba(0,45,91,0.5), rgba(0,45,91,0.5)), url("/hero-aircraft.png")', 
  backgroundSize: 'contain', // Shows full aircraft without cropping
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundColor: '#002d5b', 
  color: 'white', 
  textAlign: 'center' as const 
};

const thStyle = { padding: '20px', fontSize: '0.9rem', textTransform: 'uppercase' as const };
const tdStyle = { padding: '20px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' as const };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '2px solid #002d5b', width: '100%', fontSize: '1rem' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '18px', borderRadius: '8px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };