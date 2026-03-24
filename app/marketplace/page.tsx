'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE
interface AviationPart {
  _id: string;
  aircraftType: string;
  gearPosition: string;
  tyreSize: string;
  partNumber: string;
  plyRating: string;
  condition: string;
  priceUSD: number; 
  warehouse: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production', 
  apiVersion: '2023-05-03',
  useCdn: true,
})

export default function Marketplace() {
  const [parts, setParts] = useState<AviationPart[]>([])
  const [filteredParts, setFilteredParts] = useState<AviationPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(83.50) 
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Form Auto-fill State
  const [selectedPartNumber, setSelectedPartNumber] = useState('')
  const [selectedAircraft, setSelectedAircraft] = useState('')

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    async function fetchData() {
      setLoading(true)
      try {
        const partData = await client.fetch(`*[_type == "part"] | order(aircraftType asc)`)
        setParts(partData || [])
        setFilteredParts(partData || [])
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) setExchangeRate(rateData.rates.INR)
      } catch (e) { console.error("Sanity Sync Error:", e) }
      finally { setLoading(false) }
    }
    fetchData()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const results = parts.filter(p => 
      p.partNumber?.toLowerCase().includes(term) ||
      p.aircraftType?.toLowerCase().includes(term)
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const formatPrice = (priceUSD: number) => {
    if (currency === 'INR') return `₹${(priceUSD * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    return `$${(priceUSD || 0).toLocaleString('en-US')}`
  }

  // AUTO-FILL & SMOOTH SCROLL
  const handleInquire = (pn: string, model: string) => {
    setSelectedPartNumber(pn)
    setSelectedAircraft(model)
    const element = document.getElementById('rfq')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!mounted) return null
  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffb400', fontWeight: 'bold', letterSpacing: '3px' }}>SYNCING JEDO CLOUD INVENTORY...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. NAVIGATION - Home link before small circular switcher */}
      <nav style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <div style={smallSwitcherCircle}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeCircle : inactiveCircle}>$</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeCircle : inactiveCircle}>₹</button>
          </div>
        </div>
      </nav>

      {/* 2. SEARCH AREA */}
      <section style={{ padding: '100px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2.5rem', margin: '0 0 10px' }}>
          AIRCRAFT <span style={{ color: '#ffb400' }}>TYRE</span> INVENTORY
        </h1>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search Part Number or Aircraft Model..." 
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* 3. INVENTORY TABLE */}
      <main style={{ padding: '20px 40px 80px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#001a35', color: 'white' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>GEAR POSITION</th>
                <th style={thStyle}>TYRE SIZE</th>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>PLY RATING</th>
                <th style={thStyle}>CONDITION</th>
                <th style={thStyle}>UNIT PRICE</th>
                <th style={thStyle}>WAREHOUSE</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part._id} style={trStyle}>
                  <td style={tdStyle}><b>{part.aircraftType}</b></td>
                  <td style={tdStyle}>{part.gearPosition}</td>
                  <td style={tdStyle}>{part.tyreSize}</td>
                  <td style={{ ...tdStyle, color: '#ffb400', fontWeight: '800' }}>{part.partNumber}</td>
                  <td style={tdStyle}>{part.plyRating}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}><b>{formatPrice(part.priceUSD)}</b></td>
                  <td style={tdStyle}>{part.warehouse}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleInquire(part.partNumber, part.aircraftType)} style={inquireButtonStyle}>INQUIRE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. SOURCING CARD - AUTO-FILLED FIELDS */}
        <section id="rfq" style={formSectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>
                SUBMIT <span style={{ color: '#ffb400' }}>SOURCING</span> REQUEST
            </h2>
          </div>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={formGridStyle}>
            <input type="hidden" name="_next" value="https://jedotech.com/success" />
            
            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}>
                <label style={labelStyle}>Full Name / Buyer</label>
                <input name="buyerName" type="text" placeholder="Full Name" required style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Email Address</label>
                <input name="email" type="email" placeholder="official@company.com" required style={inputStyle} />
              </div>
            </div>

            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}>
                <label style={labelStyle}>Part Number</label>
                <input 
                  name="partNumber" 
                  type="text" 
                  value={selectedPartNumber} 
                  onChange={(e) => setSelectedPartNumber(e.target.value)} 
                  placeholder="Specify PN" 
                  style={inputStyle} 
                />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Aircraft Model</label>
                <input 
                  name="aircraft" 
                  type="text" 
                  value={selectedAircraft} 
                  onChange={(e) => setSelectedAircraft(e.target.value)} 
                  placeholder="e.g. Cessna 172" 
                  required 
                  style={inputStyle} 
                />
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={inputGroup}>
                <label style={labelStyle}>Technical Requirements</label>
                <textarea name="description" placeholder="Specify size, ply, condition, and quantity..." required style={{...inputStyle, height: '80px'}} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', width: '100%' }}>
               <button type="submit" style={submitButtonStyle}>SEND SOURCING REQUEST</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

// --- STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#001a35' };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' };

// SMALL CIRCULAR SWITCHER
const smallSwitcherCircle = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '3px' };
const activeCircle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', width: '28px', height: '28px', borderRadius: '50%', fontWeight: 'bold', fontSize: '0.7rem', cursor: 'pointer' };
const inactiveCircle = { backgroundColor: 'transparent', color: '#ffb400', border: 'none', width: '28px', height: '28px', borderRadius: '50%', fontSize: '0.7rem', cursor: 'pointer' };

const searchBarStyle = { width: '100%', padding: '20px 40px', borderRadius: '100px', border: '2px solid #001a35', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const tableWrapperStyle = { overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #001a35' };
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid #001a35' };
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' };
const badgeStyle = { backgroundColor: '#fff7e6', color: '#ffb400', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' };
const formSectionStyle = { marginTop: '80px', backgroundColor: '#001a35', padding: '40px', borderRadius: '20px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' };
const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const sideBySide = { display: 'flex', gap: '20px' };
const fullCol = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const labelStyle = { color: '#ffb400', fontSize: '0.7rem', fontWeight: 'bold' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '15px 50px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' };