'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

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

  useEffect(() => {
    async function fetchData() {
      const query = `*[_type == "part"] | order(_createdAt desc)`
      const data = await client.fetch(query)
      setParts(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const exchangeRate = 83.5;

  // --- SEARCH LOGIC ---
  const filteredParts = parts.filter((part) => {
    const searchStr = `${part.aircraftType} ${part.tyreSize} ${part.partNumber} ${part.gearPosition}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVIGATION with Switcher */}
      <nav style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
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

      {/* SEARCH BAR SECTION */}
      <section style={{ backgroundColor: '#f8fafc', padding: '40px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by Model, Size (e.g. 5.00-5), or Part Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchFieldStyle}
            />
            <span style={{ position: 'absolute', right: '20px', top: '15px', color: '#94a3b8' }}>🔍</span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {filteredParts.length} Results Found
          </div>
        </div>
      </section>

      {/* MARKETPLACE TABLE */}
      <section style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>GEAR</th>
                <th style={thStyle}>TYRE SIZE</th>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>PLY</th>
                <th style={thStyle}>EST. COST ({currency})</th>
                <th style={thStyle}>STATUS</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>Initializing Inventory...</td></tr>
              ) : filteredParts.length > 0 ? filteredParts.map((part) => {
                const cost = currency === 'INR' 
                  ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}`
                  : `$${part.priceUSD.toLocaleString()}`;

                return (
                  <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                    <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'All').toUpperCase()}</span></td>
                    <td style={tdStyle}><strong>{part.tyreSize}</strong></td>
                    <td style={tdStyle}><code style={{ color: '#64748b' }}>{part.partNumber}</code></td>
                    <td style={tdStyle}>{part.plyRating}-Ply</td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#002d5b' }}>{cost}</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>*Excl. Customs/GST</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#16a34a', fontWeight: '900', fontSize: '0.9rem' }}>Ready to Ship</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Hub: {part.warehouse}</div>
                    </td>
                    <td style={tdStyle}><a href="#rfq" style={tableBtnStyle}>GET QUOTE</a></td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>No matching tyres found in the hub.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '6px 15px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const searchFieldStyle = { width: '100%', padding: '15px 25px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: '0.2s' };
const thStyle = { padding: '20px', fontSize: '0.7rem', letterSpacing: '1px' };
const tdStyle = { padding: '25px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' as const };
const tableBtnStyle = { backgroundColor: '#002d5b', color: 'white', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '900' };