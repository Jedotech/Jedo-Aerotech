'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', // Your verified Project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Ensures immediate updates after Sanity imports
})

export default function InventoryPage() {
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // 2. FETCH DATA FROM SANITY
  useEffect(() => {
    const fetchParts = async () => {
      try {
        // Querying your custom 'part' schema
        const query = `*[_type == "part"] | order(_createdAt desc) {
          _id,
          partNumber,
          aircraftType,
          condition,
          description
        }`
        const data = await client.fetch(query)
        setParts(data)
      } catch (error) {
        console.error("Inventory Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchParts()
  }, [])

  // 3. SEARCH FILTER LOGIC
  const filteredParts = parts.filter((part) => 
    part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.aircraftType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto', cursor: 'pointer' }} />
          </Link>
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyleActive}>INVENTORY</Link>
          <a href="/#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 className="inventory-title" style={{ color: '#002d5b', fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>
            Live Inventory
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>
            Search our real-time database of Cessna and Piper training fleet components.
          </p>
        </div>

        {/* SEARCH BAR SECTION */}
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Search by Part Number, Aircraft Type, or Keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle}
          />
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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '80px', textAlign: 'center', color: '#002d5b', fontWeight: 'bold' }}>
                    Connecting to Sourcing Hub...
                  </td>
                </tr>
              ) : filteredParts.length > 0 ? (
                filteredParts.map((part: any) => (
                  <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                    <td style={tdStyle}>{part.aircraftType || 'Cessna 172'}</td>
                    <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                    <td className="hide-mobile" style={tdStyle}>{part.description}</td>
                    <td style={tdStyle}>
                      <Link 
                        href={`/#rfq?part=${encodeURIComponent(part.partNumber)}`} 
                        style={tableButtonStyle}
                      >
                        INQUIRE
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ color: '#002d5b', fontWeight: 'bold', fontSize: '1.2rem' }}>No Matching Parts Found</div>
                    <p style={{ color: '#64748b' }}>Try a different part number or contact us for custom sourcing.</p>
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

// STYLING OBJECTS
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', opacity: 0.7 };
const navLinkStyleActive = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const searchBarStyle = { width: '100%', padding: '18px', borderRadius: '10px', border: '2.5px solid #002d5b', fontSize: '1.1rem', outline: 'none', fontWeight: '600' as const, color: '#002d5b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const thStyle = { padding: '20px', fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px' };
const tdStyle = { padding: '20px', color: '#002d5b', fontSize: '1rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' as const, color: '#002d5b' };
const tableButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' as const };