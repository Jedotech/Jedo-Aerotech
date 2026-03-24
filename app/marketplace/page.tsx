'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE
interface AviationPart {
  _id: string;
  aircraftModel: string;
  gearPosition: string;
  tyreSize: string;
  partNumber: string;
  plyRating: string;
  condition: string;
  price: number; 
  warehouseLocation: string;
  description?: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // ENSURES REAL-TIME SYNC
})

export default function Marketplace() {
  const [parts, setParts] = useState<AviationPart[]>([])
  const [filteredParts, setFilteredParts] = useState<AviationPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(83.50) 
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const whatsappNumber = "919600038089"

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    async function fetchData() {
      try {
        const partData = await client.fetch(`*[_type == "part"] | order(aircraftModel asc)`)
        setParts(partData)
        setFilteredParts(partData)
        
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) setExchangeRate(rateData.rates.INR)
      } catch (e) { console.error("Sync Error:", e) }
    }
    fetchData()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const results = parts.filter(p => 
      p.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.aircraftModel?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const formatPrice = (priceUSD: number) => {
    if (currency === 'INR') return `₹${(priceUSD * exchangeRate).toLocaleString('en-IN')}`
    return `$${(priceUSD || 0).toLocaleString('en-US')}`
  }

  if (!mounted) return null

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* PROFESSIONAL NAV BAR */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/fleet-health" style={navLinkStyle}>FLEET HEALTH</Link>
        </div>
        <div style={switcherContainer}>
          <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeToggle : inactiveToggle}>USD</button>
          <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeToggle : inactiveToggle}>INR</button>
        </div>
      </nav>

      {/* REFINED HERO SECTION */}
      <header style={heroSectionStyle}>
        <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
          TYRE MARKETPLACE
        </h1>
        <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>
          <input 
            type="text" 
            placeholder="Search Part Number or Aircraft (e.g. Cessna 172)..." 
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* INVENTORY TABLE */}
      <main style={{ padding: isMobile ? '20px' : '60px', maxWidth: '1400px', margin: '0 auto' }}>
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
                <th style={thStyle}>EST. COST</th>
                <th style={thStyle}>WAREHOUSE</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part._id} style={trStyle}>
                  <td style={tdStyle}>{part.aircraftModel}</td>
                  <td style={tdStyle}>{part.gearPosition}</td>
                  <td style={tdStyle}>{part.tyreSize}</td>
                  <td style={tdStyle}><b>{part.partNumber}</b></td>
                  <td style={tdStyle}>{part.plyRating}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}><b>{formatPrice(part.price)}</b></td>
                  <td style={tdStyle}>{part.warehouseLocation}</td>
                  <td style={tdStyle}>
                    <a href={`https://wa.me/${whatsappNumber}?text=Inquiry for PN: ${part.partNumber}`} target="_blank" style={inquireButtonStyle}>INQUIRE</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPREHENSIVE SOURCING FORM */}
        <section style={formSectionStyle}>
          <h2 style={{ color: '#001a35', fontWeight: '900', textAlign: 'center', marginBottom: '10px' }}>SUBMIT SOURCING REQUEST</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '40px' }}>Can't find your part? Let our Chennai logistics desk source it for you.</p>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={formGridStyle}>
            <input name="buyerName" type="text" placeholder="Your Full Name" required style={inputStyle} />
            <input name="email" type="email" placeholder="Email Address" required style={inputStyle} />
            <input name="aircraft" type="text" placeholder="Aircraft Model (e.g. C172)" required style={inputStyle} />
            <input name="partNumber" type="text" placeholder="Part Number (If known)" style={inputStyle} />
            <textarea name="description" placeholder="Describe the parts needed (Tyre size, ply, etc.)" required style={{...inputStyle, gridColumn: isMobile ? 'auto' : 'span 2', height: '100px'}} />
            <div style={{ gridColumn: isMobile ? 'auto' : 'span 2', textAlign: 'center' }}>
               <button type="submit" style={submitButtonStyle}>SEND SOURCING REQUEST</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

// --- UPDATED STYLES ---
const navBarStyle = { position: 'fixed' as const, top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#001a35', zIndex: 1000, borderBottom: '1px solid rgba(255,255,255,0.1)' };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' };
const switcherContainer = { display: 'flex', border: '1px solid #ffb400', borderRadius: '4px', overflow: 'hidden' };
const activeToggle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '6px 15px', fontWeight: 'bold', cursor: 'pointer' };
const inactiveToggle = { backgroundColor: 'transparent', color: '#ffb400', border: 'none', padding: '6px 15px', cursor: 'pointer' };

const heroSectionStyle = { backgroundColor: '#001a35', padding: '160px 20px 100px', textAlign: 'center' as const };
const searchBarStyle = { width: '100%', padding: '20px 30px', borderRadius: '12px', border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' };

const tableWrapperStyle = { overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const thStyle = { padding: '20px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' };
const badgeStyle = { backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem' };

const formSectionStyle = { marginTop: '80px', backgroundColor: 'white', padding: '60px', borderRadius: '20px', border: '1px solid #e2e8f0' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#001a35', color: '#ffb400', padding: '18px 60px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };