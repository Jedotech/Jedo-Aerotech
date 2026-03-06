import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION (Updated with your ID)
const client = createClient({
  projectId: 'm2pa474h', // Your verified Project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false to see your imports instantly
})

// 2. DATA FETCHING FUNCTION
async function getInventory() {
  // This query matches your 'part' schema exactly
  const query = `*[_type == "part"] | order(_createdAt desc) {
    partNumber,
    aircraftType,
    condition,
    description,
    "imageUrl": partImage.asset->url
  }`
  
  try {
    return await client.fetch(query)
  } catch (error) {
    console.error("Sanity Fetch Error:", error)
    return []
  }
}

export default async function InventoryPage() {
  const parts = await getInventory();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* MOBILE-RESPONSIVE ENGINE */}
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .inventory-title { font-size: 2.2rem !important; }
          .desktop-nav { display: none !important; }
          .hide-mobile { display: none !important; }
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
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyleActive}>INVENTORY</Link>
          <a href="/#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="inventory-title" style={{ color: '#002d5b', fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>
              Live Inventory
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>
              Certified Cessna and Piper parts in stock and ready for dispatch.
            </p>
          </div>
          <div style={{ backgroundColor: '#f1f5f9', padding: '10px 20px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', color: '#002d5b' }}>
            ● {parts.length} PARTS ONLINE
          </div>
        </div>

        {/* DYNAMIC INVENTORY TABLE */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #002d5b', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Compatibility</th>
                <th style={thStyle}>Condition</th>
                <th className="hide-mobile" style={thStyle}>Description</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>{part.aircraftType || 'Cessna 172'}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td className="hide-mobile" style={tdStyle}>{part.description}</td>
                  <td style={tdStyle}>
                    <a href={`/#rfq?part=${part.partNumber}`} style={tableButtonStyle}>INQUIRE</a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ color: '#002d5b', fontWeight: 'bold', fontSize: '1.2rem' }}>No Parts Found</div>
                    <p style={{ color: '#64748b' }}>If you just imported data, please wait 30 seconds and refresh.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px', textAlign: 'center', marginTop: '80px' }}>
        <p style={{ opacity: '0.6', fontSize: '0.9rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence
        </p>
      </footer>
    </div>
  )
}

// STYLING
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', opacity: 0.7 };
const navLinkStyleActive = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const thStyle = { padding: '20px', fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px' };
const tdStyle = { padding: '20px', color: '#002d5b', fontSize: '1rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' as const, color: '#002d5b' };
const tableButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' as const };