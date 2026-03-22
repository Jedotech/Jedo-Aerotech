'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT
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
        console.error(e)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const exchangeRate = 83.5;
  const filteredParts = parts.filter(p => 
    `${p.aircraftType || ''} ${p.tyreSize || ''} ${p.partNumber || ''} ${p.gearPosition || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <Link href="/" style={{ color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' }}>← BACK TO HOME</Link>
        </div>
        <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
        </div>
      </nav>

      <section style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#002d5b', fontSize: '2.8rem', fontWeight: '900', marginBottom: '10px' }}>Tyre Marketplace</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Real-time inventory pulse from Singapore & Chennai hubs.</p>

        <input 
          type="text" 
          placeholder="Search by Model, Size, or P/N..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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
                  <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{part.aircraftType || 'N/A'}</strong></td>
                    <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                    <td style={tdStyle}><strong>{part.tyreSize || 'N/A'}</strong></td>
                    <td style={tdStyle}><code style={{ color: '#64748b' }}>{part.partNumber || 'Entry Req.'}</code></td>
                    <td style={tdStyle}>{part.plyRating || '6'}-Ply</td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#002d5b' }}>
                        {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD.toLocaleString()}`) : 'Quote Req'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: '#16a34a', fontWeight: '900' }}>In Stock</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Hub: {part.warehouse || 'Singapore'}</div>
                    </td>
                    <td style={tdStyle}><button style={actionBtnStyle}>GET QUOTE</button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center' }}>No results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#002d5b' };
const searchStyle = { width: '100%', padding: '18px', borderRadius: '10px', border: '2px solid #002d5b', marginBottom: '40px', outline: 'none' };
const thStyle = { padding: '20px', fontSize: '0.7rem', letterSpacing: '1px' };
const tdStyle = { padding: '25px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px' };
const switchBtn = { border: 'none', padding: '6px 15px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const actionBtnStyle = { backgroundColor: '#002d5b', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold' as const, cursor: 'pointer' };