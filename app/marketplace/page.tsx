'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. EXACT SANITY SCHEMA INTERFACE
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
  useCdn: false, // REAL-TIME SYNC
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
        // Querying exact field names as per your Sanity schema
        const partData = await client.fetch(`*[_type == "part"] | order("Aircraft Model" asc) {
          _id,
          "Aircraft Model",
          "Gear Position",
          "Tyre Size",
          "Part Number",
          "Ply Rating",
          "Condition",
          "Price (USD)",
          "Warehouse Location"
        }`)
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
    return (
      <div style={loaderStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffb400', fontWeight: 'bold', letterSpacing: '3px' }}>SYNCING WITH SANITY CLOUD...</p>
          <p style={{ fontSize: '0.8rem', color: '#ffffff', opacity: 0.6 }}>Updating Inventory Marketplace</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. NAVIGATION (CLEAN) */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <Link href="/" style={navLinkStyle}>HOME</Link>
        </div>
        <div style={switcherContainer}>
          <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeToggle : inactiveToggle}>USD</button>
          <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeToggle : inactiveToggle}>INR</button>
        </div>
      </nav>

      {/* 2. CIRCULAR SEARCH SECTION */}
      <section style={searchSectionStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
            AIRCRAFT <span style={{ color: '#ffb400' }}>TYRE</span> INVENTORY
          </h1>
          <input 
            type="text" 
            placeholder="Search by Part Number or Aircraft Model..." 
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* 3. INVENTORY TABLE */}
      <main style={{ padding: '0 40px 60px', maxWidth: '1440px', margin: '0 auto' }}>
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
                  <td style={tdStyle}>{part["Aircraft Model"]}</td>
                  <td style={tdStyle}>{part["Gear Position"]}</td>
                  <td style={tdStyle}>{part["Tyre Size"]}</td>
                  <td style={{ ...tdStyle, color: '#ffb400', fontWeight: '800' }}>{part["Part Number"]}</td>
                  <td style={tdStyle}>{part["Ply Rating"]}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part["Condition"]}</span></td>
                  <td style={tdStyle}><b>{formatPrice(part["Price (USD)"])}</b></td>
                  <td style={tdStyle}>{part["Warehouse Location"]}</td>
                  <td style={tdStyle}>
                    <a href={`https://wa.me/${whatsappNumber}?text=RFQ for PN: ${part["Part Number"]}`} target="_blank" style={inquireButtonStyle}>INQUIRE</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. SOURCING FORM (FORMATTED CARD) */}
        <section id="rfq" style={formSectionStyle}>
          <h2 style={{ color: '#001a35', fontWeight: '900', textAlign: 'center', marginBottom: '10px' }}>
            SUBMIT <span style={{ color: '#ffb400' }}>SOURCING</span> REQUEST
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '40px', fontSize: '0.9rem' }}>
            Complete the form below. Our global logistics desk will respond within 2 hours.
          </p>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={formGridStyle}>
            <input type="hidden" name="_next" value="https://jedotech.com/success" />
            
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input name="buyerName" type="text" placeholder="Enter name" required style={inputStyle} />
            </div>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input name="email" type="email" placeholder="Enter email" required style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Aircraft Model</label>
              <input name="aircraft" type="text" placeholder="e.g. Cessna 172" required style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Part Number</label>
              <input name="partNumber" type="text" placeholder="Enter PN" style={inputStyle} />
            </div>

            <div style={{ ...inputGroup, gridColumn: isMobile ? 'auto' : 'span 2' }}>
              <label style={labelStyle}>Detailed Requirements</label>
              <textarea name="description" placeholder="Specify tyre size, ply rating, and quantity needed..." required style={{...inputStyle, height: '120px'}} />
            </div>

            <div style={{ gridColumn: isMobile ? 'auto' : 'span 2', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
const navLinkStyle = { color: '#ffb400', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' as const, letterSpacing: '1px' };
const switcherContainer = { display: 'flex', border: '1px solid #ffb400', borderRadius: '4px', overflow: 'hidden' as const };
const activeToggle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '6px 15px', fontWeight: 'bold' as const, cursor: 'pointer' };
const inactiveToggle = { backgroundColor: 'transparent', color: '#ffb400', border: 'none', padding: '6px 15px', cursor: 'pointer' };

const searchSectionStyle = { padding: '80px 0 60px', backgroundColor: '#f8fafc' };
const searchBarStyle = { width: '100%', padding: '22px 35px', borderRadius: '100px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', boxSizing: 'border-box' as const, transition: 'all 0.3s' };

const tableWrapperStyle = { overflowX: 'auto' as const, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900' as const, letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' };
const badgeStyle = { backgroundColor: '#fff7e6', color: '#ffb400', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' as const, border: '1px solid #ffe58f' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.75rem' };

const formSectionStyle = { marginTop: '80px', backgroundColor: 'white', padding: '60px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column' as const, gap: '8px' };
const labelStyle = { fontSize: '0.75rem', fontWeight: '800' as const, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' as const };
const inputStyle = { padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fcfcfc', boxSizing: 'border-box' as const };
const submitButtonStyle = { backgroundColor: '#001a35', color: '#ffb400', padding: '18px 60px', borderRadius: '10px', border: 'none', fontWeight: '900' as const, cursor: 'pointer', fontSize: '1rem', letterSpacing: '1px' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35' };