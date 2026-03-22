'use client'

import { useState, useEffect, useRef } from 'react'
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
  const rfqSectionRef = useRef<HTMLDivElement>(null)

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

  // 1. IMPROVED EMAIL HANDLER
  const handleQuoteRequest = (part: any) => {
    const subject = encodeURIComponent(`RFQ: ${part.aircraftType} Tyre - P/N ${part.partNumber}`);
    const body = encodeURIComponent(`Dear Jedo Sourcing Team,\n\nI am interested in the following inventory item:\n\nAircraft: ${part.aircraftType}\nPart Number: ${part.partNumber}\nSize: ${part.tyreSize}\nLocation: ${part.warehouse}\n\nPlease provide a formal quote including shipping to [Insert Location] and estimated lead time.\n\nRegards,`);
    window.location.href = `mailto:tajesudoss@gmail.com?subject=${subject}&body=${body}`;
  };

  const scrollToRFQ = () => {
    rfqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* PROFESSIONAL NAVIGATION */}
      <nav style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
          </div>
          {/* HOME BUTTON ON THE RIGHT */}
          <Link href="/" style={homeTabStyle}>HOME</Link>
        </div>
      </nav>

      <section style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
                <h1 style={{ color: '#002d5b', fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>Tyre Marketplace</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Global inventory intelligence for flight schools.</p>
            </div>
            <button onClick={scrollToRFQ} style={bulkQuoteBtn}>REQUEST BULK QUOTE</button>
        </header>

        <input 
          type="text" 
          placeholder="Search by Model, Size, or P/N..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1.5px solid #cbd5e1', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
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
              ) : filteredParts.map((part) => (
                <tr key={part._id} style={{ borderBottom: '1.5px solid #cbd5e1' }}>
                  <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                  <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                  <td style={tdStyle}><strong>{part.tyreSize}</strong></td>
                  <td style={tdStyle}><code style={{ color: '#475569' }}>{part.partNumber}</code></td>
                  <td style={tdStyle}>{part.plyRating}-Ply</td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#002d5b' }}>
                      {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD.toLocaleString()}`) : 'Quote Req'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#16a34a', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ height: '8px', width: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                      Available
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hub: {part.warehouse}</div>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleQuoteRequest(part)} style={actionBtnStyle}>GET QUOTE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. NEW REQUEST FOR QUOTE SECTION */}
      <section ref={rfqSectionRef} id="rfq" style={{ backgroundColor: '#002d5b', padding: '100px 20px', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px' }}>Custom Sourcing Request</h2>
          <p style={{ opacity: 0.8, marginBottom: '40px' }}>Can't find a specific tyre? Our global procurement team can source it for you from our Singapore or US hubs within 48 hours.</p>
          
          <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <div style={formGrid}>
                <input type="text" placeholder="Full Name" style={inputStyle} />
                <input type="email" placeholder="Work Email" style={inputStyle} />
                <input type="text" placeholder="Aircraft Model" style={inputStyle} />
                <input type="text" placeholder="Quantity Required" style={inputStyle} />
            </div>
            <textarea placeholder="Tell us about your requirement..." style={{...inputStyle, height: '120px', gridColumn: 'span 2'}}></textarea>
            <button style={submitBtn}>SEND SOURCING REQUEST</button>
          </form>
        </div>
      </section>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const homeTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', border: '2px solid #ffb400', padding: '8px 25px', borderRadius: '6px', letterSpacing: '1px' };
const bulkQuoteBtn = { backgroundColor: 'transparent', color: '#002d5b', border: '2px solid #002d5b', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' as const, cursor: 'pointer' };
const searchStyle = { width: '100%', padding: '20px 25px', borderRadius: '10px', border: '2px solid #002d5b', marginBottom: '40px', outline: 'none', fontSize: '1rem' };
const thStyle = { padding: '20px', fontSize: '0.75rem', letterSpacing: '1px' };
const tdStyle = { padding: '25px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '5px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900', color: '#475569' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '6px 18px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const actionBtnStyle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: '900' as const, cursor: 'pointer', fontSize: '0.8rem' };

// FORM STYLES
const formStyle = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '15px', borderRadius: '6px', border: 'none', outline: 'none', fontSize: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' };
const submitBtn = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '20px', borderRadius: '6px', fontWeight: '900' as const, cursor: 'pointer', marginTop: '10px', fontSize: '1rem' };