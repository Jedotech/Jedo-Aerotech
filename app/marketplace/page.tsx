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
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
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

  const whatsappNumber = "919600038089"

  // STEP 1: Handle Mounting and Window Events
  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // STEP 2: Fetch Data (Separated to prevent cascade failure)
  useEffect(() => {
    if (!mounted) return;

    async function loadData() {
      try {
        // Fetch Sanity Parts
        const partData = await client.fetch(`*[_type == "part"]{
          _id, aircraftModel, gearPosition, tyreSize, partNumber, 
          plyRating, condition, price, warehouseLocation
        }`)
        setParts(partData || [])
        setFilteredParts(partData || [])

        // Fetch Exchange Rate (Fail-safe included)
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) {
          setExchangeRate(rateData.rates.INR)
        }
      } catch (error) {
        console.error("Marketplace Load Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mounted])

  // STEP 3: Handle Search
  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const results = parts.filter(p => 
      p.partNumber?.toLowerCase().includes(term) ||
      p.aircraftModel?.toLowerCase().includes(term)
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const formatPrice = (priceUSD: number) => {
    if (currency === 'INR') {
      return `₹${(priceUSD * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    }
    return `$${(priceUSD || 0).toLocaleString('en-US')}`
  }

  // CRITICAL: Return loader until client-side mount is ready
  if (!mounted || loading) {
    return <div style={loaderStyle}>SYSTEM INITIALIZING: JEDO LOGISTICS...</div>
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
        <div style={switcherContainer}>
          <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeToggle : inactiveToggle}>USD</button>
          <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeToggle : inactiveToggle}>INR</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header style={heroStyle}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>TYRE MARKETPLACE</h1>
        <p style={{ color: '#ffb400', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '30px' }}>AOG SOURCING HUB</p>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search Part Number or Aircraft Model..." 
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* INVENTORY DISPLAY */}
      <main style={{ padding: isMobile ? '20px' : '60px', maxWidth: '1440px', margin: '0 auto' }}>
        
        {isMobile ? (
          /* MOBILE VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredParts.map(part => (
              <div key={part._id} style={mobileCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '900', color: '#001a35' }}>{part.partNumber}</span>
                  <span style={badgeStyle}>{part.condition}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <b>MODEL:</b> {part.aircraftModel}<br/>
                  <b>GEAR:</b> {part.gearPosition}<br/>
                  <b>LOCATION:</b> {part.warehouseLocation}
                </div>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{formatPrice(part.price)}</span>
                   <a 
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`RFQ: PN ${part.partNumber} for ${part.aircraftModel}`)}`}
                    target="_blank"
                    style={inquireButtonStyle}
                   >INQUIRE</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DESKTOP TABLE */
          <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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
                      <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`RFQ: PN ${part.partNumber} for ${part.aircraftModel}`)}`} target="_blank" style={inquireButtonStyle}>INQUIRE</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SOURCING FORM */}
        <section style={formSectionStyle}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#001a35', fontWeight: '900' }}>SUBMIT SOURCING REQUEST</h2>
            <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '15px' }}>
              <input name="partNumber" type="text" placeholder="Part Number" required style={inputStyle} />
              <input name="aircraft" type="text" placeholder="Aircraft Model" required style={inputStyle} />
              <button type="submit" style={submitButtonStyle}>SEND REQUEST</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

// STYLES
const navStyle = { position: 'fixed' as const, top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#001a35', zIndex: 1000, boxSizing: 'border-box' as const };
const heroStyle = { backgroundColor: '#001a35', padding: '120px 20px 80px', textAlign: 'center' as const };
const searchBarStyle = { width: '100%', padding: '18px 25px', borderRadius: '50px', border: 'none', fontSize: '1rem', outline: 'none' };
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' };
const badgeStyle = { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 18px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem' };
const mobileCardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #ffb400', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const formSectionStyle = { marginTop: '80px', backgroundColor: '#ffffff', padding: '40px 20px', borderRadius: '20px', border: '1px solid #e2e8f0' };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' };
const submitButtonStyle = { backgroundColor: '#001a35', color: '#ffb400', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' };
const switcherContainer = { display: 'flex', border: '1px solid #ffb400', borderRadius: '6px', overflow: 'hidden' };
const activeToggle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer' };
const inactiveToggle = { backgroundColor: 'transparent', color: '#ffb400', border: 'none', padding: '8px 15px', cursor: 'pointer' };