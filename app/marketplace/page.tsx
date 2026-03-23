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
  const [exchangeRate, setExchangeRate] = useState(94.0)
  
  // FORM STATES
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aircraft: '',
    quantity: '',
    message: ''
  })

  const rfqSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getLiveRate() {
      try {
        const apiKey = 'cf89f7b96ff3c0675edcfe39'
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
        const data = await response.json()
        if (data.result === "success") {
          setExchangeRate(data.conversion_rates.INR)
        }
      } catch (error) {
        console.error("Currency API failed", error)
      }
    }

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

    getLiveRate()
    fetchData()
  }, [])

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
    setIsSuccess(false);
    scrollToRFQ();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mdalbdqq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("There was an error. Please email tajesudoss@gmail.com directly.");
      }
    } catch (error) {
      console.error("Submission error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', scrollBehavior: 'smooth' }}>
      
      {/* NAV BAR */}
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

      {/* HEADER & INVENTORY */}
      <section style={{ padding: '40px 20px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px' }}>Tyre Marketplace</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>Live Rates: 1 USD = ₹{exchangeRate.toFixed(2)}</p>
        </header>

        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Search by Aircraft, Size, or P/N..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchStyle}
          />
          <span style={{ position: 'absolute', right: '20px', top: '20px', opacity: 0.4 }}>🔍</span>
        </div>

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
              ) : filteredParts.length > 0 ? filteredParts.map((part) => (
                <tr key={part._id} style={{ borderBottom: '1.5px solid #cbd5e1' }}>
                  <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                  <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                  <td style={tdStyle}><strong>{part.tyreSize}</strong></td>
                  <td style={tdStyle}><code style={{ color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{part.partNumber}</code></td>
                  <td style={tdStyle}>{part.plyRating}-Ply</td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#002d5b' }}>
                      {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD.toLocaleString()}`) : 'Quote Req'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#16a34a', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ height: '8px', width: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                      In Stock
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{part.warehouse} Hub</div>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => triggerQuoteForm(part)} style={actionBtnStyle}>GET QUOTE</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
                    No direct matches found. <button onClick={scrollToRFQ} style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Request Sourcing</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SOURCING SECTION */}
      <section 
        ref={rfqSectionRef} 
        id="rfq" 
        style={{ 
          backgroundColor: '#002d5b', 
          padding: '100px 20px', 
          color: 'white', 
          marginTop: '80px',
          scrollMarginTop: '100px'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {isSuccess ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '2px solid #10b981', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#002d5b', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 10px 0' }}>REQUEST RECEIVED</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '30px', lineHeight: '1.6' }}>
                Our procurement desk has been notified.<br />
                We will reach out to you shortly.
              </p>
              <button 
                onClick={() => setIsSuccess(false)} 
                style={{ backgroundColor: '#002d5b', color: '#ffb400', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ← Send Another Request
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', textAlign: 'center' }}>Sourcing Request</h2>
              <p style={{ opacity: 0.8, marginBottom: '40px', textAlign: 'center' }}>Submit your requirements and our global desk will find the parts for you.</p>
              <form style={formStyle} onSubmit={handleSubmit}>
                <div style={formGrid}>
                    <input required name="name" type="text" placeholder="Your Name" style={inputStyle} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input required name="email" type="email" placeholder="Email Address" style={inputStyle} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input required name="aircraft" type="text" placeholder="Aircraft Model" style={inputStyle} value={formData.aircraft} onChange={(e) => setFormData({...formData, aircraft: e.target.value})} />
                    <input required name="quantity" type="text" placeholder="Quantity Required" style={inputStyle} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <textarea required name="message" placeholder="Details of your requirement..." style={{...inputStyle, height: '150px', gridColumn: 'span 2'}} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                <button disabled={isSubmitting} type="submit" style={submitBtn}>
                  {isSubmitting ? 'PROCESSING...' : 'SUBMIT SOURCING REQUEST'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <footer style={{ backgroundColor: '#001a35', color: 'rgba(255,255,255,0.5)', padding: '40px', textAlign: 'center', fontSize: '0.8rem' }}>
        © 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const tableContainerStyle = { overflowX: 'auto' as const, borderRadius: '12px', border: '1.5px solid #cbd5e1', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', marginBottom: '40px' };
const thStyle = { padding: '20px', fontSize: '0.75rem', letterSpacing: '1px' };
const tdStyle = { padding: '25px', color: '#002d5b', fontSize: '0.95rem' };
const searchStyle = { width: '100%', padding: '20px 25px', borderRadius: '10px', border: '2px solid #002d5b', outline: 'none', fontSize: '1rem' };
const homeTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', border: '2px solid #ffb400', padding: '8px 25px', borderRadius: '6px' };
const sourcingBadgeStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '6px' };
const sourcingLinkStyle = { background: 'none', border: 'none', color: '#ffb400', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' as const, fontSize: '0.75rem', padding: 0 };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '5px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900', color: '#475569' };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px', backgroundColor: 'rgba(0,0,0,0.2)' };
const switchBtn = { border: 'none', padding: '6px 18px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const actionBtnStyle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: '900' as const, cursor: 'pointer', fontSize: '0.8rem' };
const formStyle = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', fontSize: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' };
const submitBtn = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '20px', borderRadius: '8px', fontWeight: '900' as const, cursor: 'pointer', fontSize: '1rem' };