'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE (Exact Sanity field names)
interface AviationPart {
  _id: string;
  "Aircraft Model": string;
  "Gear Position": string;
  "Tyre Size": string;
  "Part Number": string;
  "Ply Rating": string;
  "Condition": string;
  "Price (USD)": number; 
  "Warehouse Location": string;
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

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    async function fetchData() {
      setLoading(true)
      try {
        const partData = await client.fetch(`*[_type == "part"] | order("Aircraft Model" asc)`)
        setParts(partData || [])
        setFilteredParts(partData || [])
        
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) setExchangeRate(rateData.rates.INR)
      } catch (e) { 
        console.error("Sanity Sync Error:", e) 
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const results = parts.filter(p => 
      p["Part Number"]?.toLowerCase().includes(term) ||
      p["Aircraft Model"]?.toLowerCase().includes(term)
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const formatPrice = (priceUSD: number) => {
    if (currency === 'INR') return `₹${(priceUSD * exchangeRate).toLocaleString('en-IN')}`
    return `$${(priceUSD || 0).toLocaleString('en-US')}`
  }

  if (!mounted) return null

  if (loading) {
    return <div style={loaderStyle}>SYNCHRONIZING JEDO CLOUD INVENTORY...</div>
  }

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. NAVIGATION */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <Link href="/" style={navLinkStyle}>DASHBOARD</Link>
        </div>
        <div style={switcherContainer}>
          <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeToggle : inactiveToggle}>USD</button>
          <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeToggle : inactiveToggle}>INR</button>
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
            placeholder="Search by Part Number or Aircraft Model..." 
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* 3. TABLE SECTION */}
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
              {filteredParts.length > 0 ? filteredParts.map(part => (
                <tr key={part._id} style={trStyle}>
                  <td style={tdStyle}><b>{part["Aircraft Model"]}</b></td>
                  <td style={tdStyle}>{part["Gear Position"]}</td>
                  <td style={tdStyle}>{part["Tyre Size"]}</td>
                  <td style={{ ...tdStyle, color: '#ffb400', fontWeight: '800' }}>{part["Part Number"]}</td>
                  <td style={tdStyle}>{part["Ply Rating"]}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part["Condition"]}</span></td>
                  <td style={tdStyle}><b>{formatPrice(part["Price (USD)"])}</b></td>
                  <td style={tdStyle}>{part["Warehouse Location"]}</td>
                  <td style={tdStyle}>
                    <a href={`https://wa.me/${whatsappNumber}?text=Inquiry for PN: ${part["Part Number"]}`} target="_blank" style={inquireButtonStyle}>INQUIRE</a>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>No certified parts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. SOURCING REQUEST CARD (3-ROW STRUCTURE) */}
        <section id="rfq" style={formSectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.8rem', margin: 0 }}>SUBMIT <span style={{ color: '#ffb400' }}>SOURCING</span> REQUEST</h2>
          </div>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={formGridStyle}>
            <input type="hidden" name="_next" value="https://jedotech.com/success" />
            
            {/* ROW 1: Name & Email */}
            <div style={rowStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Full Name / Buyer</label>
                <input name="buyerName" type="text" placeholder="Enter name" required style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Email Address</label>
                <input name="email" type="email" placeholder="official@company.com" required style={inputStyle} />
              </div>
            </div>

            {/* ROW 2: Part Number & Aircraft Model */}
            <div style={rowStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Part Number</label>
                <input name="partNumber" type="text" placeholder="Specify PN" style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Aircraft Model</label>
                <input name="aircraft" type="text" placeholder="e.g. Cessna 172" required style={inputStyle} />
              </div>
            </div>

            {/* ROW 3: Technical Requirements */}
            <div style={{ width: '100%' }}>
              <div style={inputGroup}>
                <label style={labelStyle}>Technical Requirements</label>
                <textarea name="description" placeholder="Specify size, ply, condition, and quantity..." required style={{...inputStyle, height: '100px'}} />
              </div>
            </div>

            {/* ROW 4: Centered Submit */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
               <button type="submit" style={submitButtonStyle}>SEND SOURCING REQUEST</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

// --- CSS STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#001a35', boxSizing: 'border-box' as const };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' as const };
const switcherContainer = { display: 'flex', border: '1px solid #ffb400', borderRadius: '4px', overflow: 'hidden' as const };
const activeToggle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '6px 15px', fontWeight: 'bold' as const, cursor: 'pointer' };
const inactiveToggle = { backgroundColor: 'transparent', color: '#ffb400', border: 'none', padding: '6px 15px', cursor: 'pointer' };

const searchBarStyle = { width: '100%', padding: '20px 40px', borderRadius: '100px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', boxSizing: 'border-box' as const };

const tableWrapperStyle = { overflowX: 'auto' as const, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900' as const, letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' };
const badgeStyle = { backgroundColor: '#fff7e6', color: '#ffb400', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' as const };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.75rem' };

const formSectionStyle = { marginTop: '100px', backgroundColor: '#001a35', padding: '60px', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' };
const formGridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '25px' };
const rowStyle = { display: 'flex', gap: '25px', flexWrap: 'wrap' as const };
const inputGroup = { display: 'flex', flexDirection: 'column' as const, gap: '10px', flex: 1, minWidth: '280px' };
const labelStyle = { color: '#ffb400', fontSize: '0.7rem', fontWeight: 'bold' as const, letterSpacing: '1px' };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '18px 60px', borderRadius: '8px', border: 'none', fontWeight: 'bold' as const, fontSize: '0.95rem', cursor: 'pointer' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' as const };