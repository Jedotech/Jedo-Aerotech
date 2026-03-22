import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

// 2. DYNAMIC DATA FETCHING
async function getHomepageData() {
  const query = `{
    "parts": *[_type == "part"] | order(_createdAt desc) [0...8] {
      _id,
      partNumber,
      tyreSize,
      aircraftType,
      gearPosition,
      plyRating,
      priceUSD,
      quantity,
      warehouse,
      "totalLandings": coalesce(totalLandings, 0),
      "maxLife": coalesce(maxDesignLife, 350)
    },
    "totalCount": count(*[_type == "part"]),
    "criticalCount": count(*[_type == "part" && totalLandings >= maxDesignLife * 0.85])
  }`
  try {
    return await client.fetch(query)
  } catch (e) {
    console.error("Fetch error:", e)
    return { parts: [], totalCount: 0, criticalCount: 0 }
  }
}

export default async function HomePage() {
  const { parts, totalCount, criticalCount } = await getHomepageData();
  const fleetHealth = totalCount > 0 ? Math.round(((totalCount - criticalCount) / totalCount) * 100) : 100;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.8rem !important; }
          .desktop-nav { display: none !important; }
          .hero-btn-container { flex-direction: column; gap: 10px; }
          .stats-grid { grid-template-columns: 1fr !important; }
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

      {/* HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 className="hero-title" style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', maxWidth: '850px', margin: '0 auto 30px', opacity: 0.95 }}>
            Specialized brokerage for Cessna & Piper. We source, verify, and deliver certified aviation tyres to your hangar.
          </p>
          
          <div className="hero-btn-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/inventory" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="https://jedo-fleet-intel.vercel.app" style={secondaryButtonStyle}>Fleet Intel Login</Link>
          </div>
        </div>
      </section>

      {/* LIVE ASSET PULSE */}
      <section style={{ backgroundColor: '#002d5b', padding: '40px 20px', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>TOTAL TRACKED ASSETS</span>
            <span style={statValueStyle}>{totalCount} Units</span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>FLEET HEALTH RATING</span>
            <span style={statValueStyle}>{fleetHealth}%</span>
          </div>
          <div style={{...statCardStyle, backgroundColor: '#ffb400', border: 'none'}}>
            <span style={{...statLabelStyle, color: '#002d5b'}}>SOURCING HUB STATUS</span>
            <span style={{...statValueStyle, color: '#002d5b'}}>CHENNAI LIVE</span>
          </div>
        </div>
      </section>

      {/* SOURCING PREVIEW - UPDATED TABLE */}
      <section style={{ padding: '80px 20px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ color: '#002d5b', fontWeight: '800', fontSize: '2.5rem', margin: 0 }}>Global Availability</h2>
            <p style={{ color: '#64748b', fontWeight: 'bold' }}>Live inventory pulse from Chennai & Singapore hubs</p>
          </div>
          <Link href="/inventory" style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'none', borderBottom: '3px solid #ffb400', paddingBottom: '5px' }}>
            Full Marketplace →
          </Link>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={thStyle}>Aircraft Model</th>
                <th style={thStyle}>Gear Position</th>
                <th style={thStyle}>Tyre Size</th>
                <th style={thStyle}>Ply</th>
                <th style={thStyle}>Part Number (P/N)</th>
                <th style={thStyle}>Est. Cost (INR)</th>
                <th style={thStyle}>Sourcing Status</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => {
                // Currency conversion (Approx 1 USD = 83.5 INR)
                const costINR = part.priceUSD ? Math.round(part.priceUSD * 83.5).toLocaleString('en-IN') : 'Quote Req';
                
                return (
                  <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{part.aircraftType}</td>
                    <td style={tdStyle}>{part.gearPosition || 'Main / Nose'}</td>
                    <td style={tdStyle}><strong>{part.tyreSize || '5.00-5'}</strong></td>
                    <td style={tdStyle}>{part.plyRating}-Ply</td>
                    <td style={tdStyle}><code style={{fontSize: '0.8rem', color: '#64748b'}}>{part.partNumber}</code></td>
                    <td style={tdStyle}><strong>₹{costINR}</strong></td>
                    <td style={tdStyle}>
                        <span style={{
                            ...badgeStyle, 
                            backgroundColor: part.quantity > 0 ? '#dcfce7' : '#f1f5f9',
                            color: part.quantity > 0 ? '#166534' : '#475569'
                        }}>
                            {part.quantity > 0 ? `In Stock (${part.warehouse})` : 'Source on Request'}
                        </span>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Syncing Global Inventory Hubs...</td></tr>
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
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Our brokerage network spans USA, Singapore, and India. Tell us your requirement.</p>
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
          © 2026 Jedo Technologies Pvt. Ltd. | Aviation Tyre Intelligence & Brokerage
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
  minHeight: '90vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundImage: 'linear-gradient(rgba(0,45,91,0.6), rgba(0,45,91,0.6)), url("/hero-aircraft.png")', 
  backgroundSize: 'cover', 
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundColor: '#002d5b', 
  color: 'white', 
  textAlign: 'center' as const
};

const statCardStyle = { padding: '25px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const statLabelStyle = { fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: '#ffb400', marginBottom: '5px' };
const statValueStyle = { fontSize: '2rem', fontWeight: '900', color: 'white' };

const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };
const thStyle = { padding: '25px', fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#64748b' };
const tdStyle = { padding: '25px', color: '#002d5b', fontSize: '1rem' };
const badgeStyle = { padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' as const };
const inputStyle = { padding: '18px', borderRadius: '10px', border: '2px solid #cbd5e1', width: '100%', fontSize: '1rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };