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

export default function MarketplacePage() {
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const query = `*[_type == "part"] | order(_createdAt desc) {
        _id, aircraftType, gearPosition, tyreSize, partNumber, plyRating, priceUSD, quantity, warehouse
      }`
      try {
        const data = await client.fetch(query)
        setParts(data)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const exchangeRate = 83.5;
  const filteredParts = parts.filter(p => 
    `${p.aircraftType || ''} ${p.tyreSize || ''} ${p.partNumber || ''} ${p.gearPosition || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleQuoteRequest = (part: any) => {
    const subject = encodeURIComponent(`RFQ: ${part.aircraftType} Tyre (${part.partNumber})`);
    const body = encodeURIComponent(`Hello Jedo Team,\n\nI am interested in sourcing the following tyre:\n\nAircraft: ${part.aircraftType}\nPart Number: ${part.partNumber}\nSize: ${part.tyreSize}\n\nPlease provide a formal quote and lead time.\n\nThank you.`);
    window.location.href = `mailto:tajesudoss@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* PROFESSIONAL NAVIGATION */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} />
          </Link>
          {/* REPLACED AMATEUR LINK WITH PROFESSIONAL TAB */}
          <Link href="/" style={homeTabStyle}>
            HOME
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
          </div>
        </div>
      </nav>

      <section style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}>
            <h1 style={{ color: '#002d5b', fontSize: '3rem', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>Tyre Marketplace</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>Direct sourcing for Cessna & Piper training fleets.</p>
        </header>

        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Search by Model, Size, or P/N..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchStyle}
          />
          <span style={{ position: 'absolute', right: '20px', top: '18px', opacity: 0.3 }}>🔍</span>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>GEAR POSITION</th>
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
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center' }}>Loading Hub...</td></tr>
              ) : filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <tr key={part._id} style={{ borderBottom: '1.5px solid #cbd5e1' }}>
                    <td style={tdStyle}><strong>{part.aircraftType || 'N/A'}</strong></td>
                    <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                    <td style={tdStyle}><strong>{part.tyreSize || 'N/A'}</strong></td>
                    <td style={tdStyle}><code style={{ color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{part.partNumber || 'Entry Req.'}</code></td>
                    <td style={tdStyle}>{part.plyRating || '6'}-Ply</td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#002d5b' }}>
                        {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD.toLocaleString()}`) : 'Quote Req'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#16a34a', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ height: '8px', width: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                        Ready to Ship
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Hub: {part.warehouse || 'Singapore'}</div>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => handleQuoteRequest(part)}
                        style={actionBtnStyle}
                      >
                        GET QUOTE
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>No matching inventory found in the hub.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const homeTabStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '4px', letterSpacing: '1px' };
const searchStyle = { width: '100%', padding: '18px 25px', borderRadius: '10px', border: '2px solid #002d5b', outline: 'none', backgroundColor: '#fff', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
const thStyle = { padding: '20px', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold' as const };
const tdStyle = { padding: '25px', color: '#002d5b', fontSize: '0.95rem' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '5px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900', color: '#475569' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '6px 18px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.2s' };
const actionBtnStyle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: '900' as const, cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.5px' };