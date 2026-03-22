'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [loading, setLoading] = useState(true)

  // 2. FETCH DATA FROM SANITY
  useEffect(() => {
    async function fetchData() {
      const query = `*[_type == "part"] | order(_createdAt desc) {
        _id,
        aircraftType,
        gearPosition,
        tyreSize,
        partNumber,
        plyRating,
        priceUSD,
        quantity,
        warehouse
      }`
      try {
        const data = await client.fetch(query)
        setParts(data)
        setLoading(false)
      } catch (e) {
        console.error("Fetch error:", e)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const exchangeRate = 83.5;

  // 3. SEARCH LOGIC
  const filteredParts = parts.filter((part) => {
    const searchStr = `${part.aircraftType} ${part.tyreSize} ${part.partNumber} ${part.gearPosition}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* NAVIGATION BAR */}
      <nav style={navStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '40px', width: 'auto' }} />
        </Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* CURRENCY TOGGLE */}
          <div style={switcherContainer}>
            <button 
              onClick={() => setCurrency('INR')}
              style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}
            >INR</button>
            <button 
              onClick={() => setCurrency('USD')}
              style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}
            >USD</button>
          </div>
          <a href="#rfq" style={quoteButtonStyle}>REQUEST SOURCING</a>
        </div>
      </nav>

      {/* HEADER */}
      <header style={{ padding: '60px 20px', textAlign: 'left', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#002d5b', marginBottom: '10px' }}>Tyre Marketplace</h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Global sourcing intelligence for training aircraft fleets.</p>
      </header>

      {/* SEARCH BAR */}
      <section style={{ padding: '0 20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by aircraft model, gear position, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchFieldStyle}
          />
          <span style={{ position: 'absolute', right: '25px', top: '18px', fontSize: '1.2rem' }}>🔍</span>
        </div>
      </section>

      {/* INVENTORY TABLE - 8 COLUMNS */}
      <section style={{ padding: '0 20px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>GEAR POSITION</th>
                <th style={thStyle}>TYRE SIZE</th>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>PLY</th>
                <th style={thStyle}>EST. COST ({currency})</th>
                <th style={thStyle}>SOURCING STATUS</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>Syncing with Global Hubs...</td></tr>
              ) : filteredParts.length > 0 ? filteredParts.map((part: any) => {
                const cost = currency === 'INR' 
                  ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}`
                  : `$${part.priceUSD?.toLocaleString()}`;

                return (
                  <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                    <td style={tdStyle}>
                      <span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span>
                    </td>
                    <td style={tdStyle}><strong>{part.tyreSize || 'N/A'}</strong></td>
                    <td style={tdStyle}><code style={{ color: '#64748b' }}>{part.partNumber || 'Entry Required'}</code></td>
                    <td style={tdStyle}>
                      <span style={{ border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                        {part.plyRating}-Ply
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#002d5b' }}>
                        {part.priceUSD ? cost : 'Contact for Quote'}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>*Excl. Customs/GST</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#16a34a', fontWeight: '900', fontSize: '0.9rem' }}>Ready to Ship</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Hub: {part.warehouse || 'Global'}</div>
                    </td>
                    <td style={tdStyle}>
                      <a href="#rfq" style={tableBtnStyle}>GET QUOTE</a>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>No matching inventory found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={{ backgroundColor: '#f8fafc', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 Jedo Technologies Pvt. Ltd. | Aviation Tyre Intelligence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '6px 15px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.2s' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const searchFieldStyle = { width: '100%', padding: '18px 25px', borderRadius: '8px', border: '2px solid #002d5b', fontSize: '1rem', outline: 'none' };
const thStyle = { padding: '20px', fontSize: '0.7rem', letterSpacing: '1px' };
const tdStyle = { padding: '20px 25px', color: '#002d5b', fontSize: '0.95rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900', color: '#475569' };
const tableBtnStyle = { backgroundColor: '#002d5b', color: 'white', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '900', display: 'inline-block' };