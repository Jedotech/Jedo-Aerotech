import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'YOUR_PROJECT_ID_HERE', // Paste your 8-character ID here
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

// 2. DATA FETCHING FUNCTION (Matches your custom Schema)
async function getInventory() {
  const query = `*[_type == "part"] | order(_createdAt desc) {
    partNumber,
    aircraftType,
    condition,
    description,
    location,
    "imageUrl": partImage.asset->url
  }`
  return await client.fetch(query)
}

export default async function InventoryPage() {
  const parts = await getInventory();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* MOBILE-RESPONSIVE ENGINE */}
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .inventory-title { font-size: 2rem !important; }
          .desktop-nav { display: none !important; }
          .inventory-table th:nth-child(4), .inventory-table td:nth-child(4) { display: none; } /* Hide description on mobile for space */
        }
      `}</style>

      {/* NAVIGATION BAR */}
      <nav className="nav-container" style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img 
              src="/jedo-logo.png" 
              alt="Jedo Technologies" 
              style={{ height: '45px', width: 'auto', cursor: 'pointer' }} 
            />
          </Link>
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyleActive}>INVENTORY</Link>
          <a href="/#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="inventory-title" style={{ color: '#002d5b', fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>
          Live Inventory
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px' }}>
          Certified aircraft parts ready for immediate dispatch from Chennai and global hubs.
        </p>

        {/* DYNAMIC INVENTORY TABLE */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #002d5b', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Compatibility</th>
                <th style={thStyle}>Condition</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {parts.length > 0 ? parts.map((part: any) => (
                <tr key={part.partNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>{part.aircraftType || 'Universal'}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}>{part.description}</td>
                  <td style={tdStyle}>
                    <a href={`/#rfq?part=${part.partNumber}`} style={tableButtonStyle}>INQUIRE</a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                    Updating inventory database... Please check back in a moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px', textAlign: 'center', marginTop: '80px' }}>
        <p style={{ opacity: '0.6', fontSize: '0.9rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Aviation Excellence in India
        </p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', opacity: 0.7 };
const navLinkStyleActive = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const thStyle = { padding: '20px' };
const tdStyle = { padding: '20px', color: '#002d5b', fontSize: '0.95rem' };
const badgeStyle = { backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' as const, color: '#002d5b', border: '1px solid #e2e8f0' };
const tableButtonStyle = { backgroundColor: '#002d5b', color: 'white', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' as const };