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
      const data = await client.fetch(query)
      setParts(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredParts = parts.filter(p => 
    `${p.aircraftType} ${p.tyreSize} ${p.partNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* NAVIGATION with "Back to Home" */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <Link href="/" style={{ color: '#ffb400', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>← BACK TO HOME</Link>
        </div>
        <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
        </div>
      </nav>

      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '900' }}>Tyre Marketplace</h1>
        <input 
          type="text" 
          placeholder="Search inventory..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #002d5b', margin: '20px 0' }}
        />
        {/* Table logic same as before... */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#002d5b', color: '#ffb400' }}>
                    <tr>
                        <th style={thStyle}>MODEL</th>
                        <th style={thStyle}>SIZE</th>
                        <th style={thStyle}>P/N</th>
                        <th style={thStyle}>COST ({currency})</th>
                        <th style={thStyle}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParts.map(part => (
                        <tr key={part._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}>{part.aircraftType}</td>
                            <td style={tdStyle}>{part.tyreSize}</td>
                            <td style={tdStyle}>{part.partNumber}</td>
                            <td style={tdStyle}>{currency === 'INR' ? `₹${Math.round(part.priceUSD * 83.5)}` : `$${part.priceUSD}`}</td>
                            <td style={tdStyle}><button style={tableBtnStyle}>GET QUOTE</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  )
}

// Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#002d5b' };
const thStyle = { padding: '15px', textAlign: 'left' as const };
const tdStyle = { padding: '15px' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px' };
const switchBtn = { border: 'none', padding: '6px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.7rem' };
const tableBtnStyle = { backgroundColor: '#002d5b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold' as const };