import Link from 'next/link'

export default function InventoryPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVIGATION BAR - FIXED FOR INVENTORY PAGE */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            {/* The "/" at the start of the src is the secret to making it visible here */}
            <img 
              src="/jedo-logo.png" 
              alt="Jedo Technologies" 
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }} 
            />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="/#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
          Current Inventory
        </h1>
        <p style={{ color: '#64748b', marginBottom: '40px' }}>
          Certified aircraft parts ready for immediate dispatch from Chennai.
        </p>

        {/* INVENTORY TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400' }}>
                <th style={thStyle}>Part Number</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Condition</th>
                <th style={thStyle}>Availability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>066-5000-05</td>
                <td style={tdStyle}>KI-209 VOR/LOC/GS Indicator</td>
                <td style={tdStyle}>Overhauled</td>
                <td style={tdStyle}>In Stock</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={tdStyle}>12701-001</td>
                <td style={tdStyle}>Cessna 172 Seat Rail</td>
                <td style={tdStyle}>New (OEM)</td>
                <td style={tdStyle}>2 Units</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '40px', textAlign: 'center', marginTop: '60px' }}>
        <p>© 2026 Jedo Technologies | Aviation Sourcing Excellence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '20px 60px', 
  backgroundColor: '#002d5b', 
  position: 'sticky' as const, 
  top: 0, 
  zIndex: 100 
};

const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };

const quoteButtonStyle = { 
  backgroundColor: '#ffb400', 
  color: '#002d5b', 
  padding: '10px 25px', 
  borderRadius: '4px', 
  textDecoration: 'none', 
  fontWeight: 'bold' as const 
};

// TABLE STYLES
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px', border: '2px solid #002d5b' };
const thStyle = { padding: '15px', textAlign: 'left' as const, borderBottom: '2px solid #002d5b' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #e2e8f0', color: '#002d5b', fontWeight: '500' };