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
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aircraft: '',
    quantity: '',
    message: ''
  })

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

  const scrollToRFQ = () => {
    rfqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerQuoteForm = (part: any) => {
    setFormData({
      ...formData,
      aircraft: part.aircraftType || '',
      message: `Requesting quote for:\nPart Number: ${part.partNumber}\nSize: ${part.tyreSize}\nPosition: ${part.gearPosition}\nHub: ${part.warehouse}`
    })
    scrollToRFQ();
  };

  return (
    <div style={pageWrapperStyle}>
      
      {/* 1. PRIMARY NAV */}
      <nav style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={sourcingBadgeStyle}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', fontWeight: '900' }}>OFFLINE PROCUREMENT</span>
            <button onClick={scrollToRFQ} style={sourcingLinkStyle}>PART NOT LISTED? REQUEST SOURCING</button>
          </div>
          <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
          </div>
          <Link href="/" style={homeTabStyle}>HOME</Link>
        </div>
      </nav>

      {/* 2. STICKY SEARCH HEADER */}
      <div style={stickyHeaderWrapper}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '15px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
            <div>
              <h1 style={{ color: '#002d5b', fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>Tyre Marketplace</h1>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Showing {filteredParts.length} verified inventory units.</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Filter by Aircraft, Size, or P/N..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchStyle}
            />
            <span style={{ position: 'absolute', right: '15px', top: '12px', opacity: 0.4 }}>🔍</span>
          </div>
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <section style={{ padding: '0 20px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={tableContainerStyle}>
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
                <tr><td colSpan={8} style={{ padding: '100px', textAlign: 'center' }}>Syncing Inventory...</td></tr>
              ) : filteredParts.map((part) => (
                <tr key={part._id} style={{ borderBottom: '1.5px solid #cbd5e1' }}>
                  <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                  <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                  <td style={tdStyle}><strong>{part.tyreSize}</strong></td>
                  <td style={tdStyle}><code style={{ color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{part.partNumber}</code></td>
                  <td style={tdStyle}>{part.plyRating}-Ply</td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#002d5b' }}>
                      {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD.toLocaleString()}`) : 'Quote Req'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#16a34a', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ height: '8px', width: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                      In Stock
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{part.warehouse} Hub</div>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => triggerQuoteForm(part)} style={actionBtnStyle}>GET QUOTE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. RFQ FORM */}
      <section ref={rfqSectionRef} id="rfq" style={{ backgroundColor: '#002d5b', padding: '100px 20px', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', textAlign: 'center' }}>Sourcing Request</h2>
          <p style={{ opacity: 0.8, marginBottom: '40px', textAlign: 'center' }}>Submit your requirement and our global procurement team will find it for you.</p>
          <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <div style={formGrid}>
                <input type="text" placeholder="Your Name" style={inputStyle} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Email Address" style={inputStyle} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="text" placeholder="Aircraft Model" style={inputStyle} value={formData.aircraft} onChange={(e) => setFormData({...formData, aircraft: e.target.value})} />
                <input type="text" placeholder="Quantity Required" style={inputStyle} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
            </div>
            <textarea placeholder="Details..." style={{...inputStyle, height: '150px', gridColumn: 'span 2'}} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
            <button style={submitBtn}>SUBMIT SOURCING REQUEST</button>
          </form>
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'rgba(255,255,255,0.5)', padding: '40px', textAlign: 'center', fontSize: '0.8rem' }}>
        © 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence
      </footer>
    </div>
  )
}

// STYLES
const pageWrapperStyle = { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', scrollBehavior: 'smooth' as const };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 3000 };
const stickyHeaderWrapper = { position: 'sticky' as const, top: '70px', zIndex: 2000, backgroundColor: 'rgba(248, 250, 252, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #cbd5e1', marginBottom: '20px' };
const tableContainerStyle = { overflowX: 'auto' as const, borderRadius: '12px', border: '1.5px solid #cbd5e1', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' };
const thStyle = { padding: '15px 20px', fontSize: '0.7rem', letterSpacing: '1px', position: 'sticky' as const, top: 0, backgroundColor: '#002d5b', zIndex: 10, borderBottom: '2px solid #ffb400' };
const tdStyle = { padding: '15px 20px', color: '#002d5b', fontSize: '0.85rem' };
const searchStyle = { width: '100%', padding: '12px 20px', borderRadius: '8px', border: '2px solid #002d5b', outline: 'none', fontSize: '0.95rem' };
const homeTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.8rem', border: '2px solid #ffb400', padding: '6px 20px', borderRadius: '4px' };
const sourcingBadgeStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '6px' };
const sourcingLinkStyle = { background: 'none', border: 'none', color: '#ffb400', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' as const, fontSize: '0.7rem', padding: 0 };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900', color: '#475569' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '4px 14px', borderRadius: '18px', fontSize: '0.7rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const actionBtnStyle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '8px 18px', borderRadius: '4px', fontWeight: '900' as const, cursor: 'pointer', fontSize: '0.7rem' };
const formStyle = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' };
const submitBtn = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: '900' as const, cursor: 'pointer' };