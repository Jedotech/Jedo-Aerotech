'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// TYPE-SAFE INTERFACE
interface AviationPart {
  _id: string;
  partNumber: string;
  description: string;
  category?: string;
  condition?: string;
  location?: string;
  stockStatus?: string;
  price?: number;
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
  const [isMobile, setIsMobile] = useState(false)
  
  // CURRENCY STATE
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [exchangeRate, setExchangeRate] = useState<number>(93.86) // Default fallback

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function fetchData() {
      // 1. Fetch Parts from Sanity
      const partQuery = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        category,
        condition,
        location,
        stockStatus,
        price
      }`
      
      try {
        const [partData, exchangeData] = await Promise.all([
          client.fetch(partQuery),
          // 2. Fetch Live Exchange Rate (Using standard ExchangeRate-API)
          fetch('https://api.exchangerate-api.com/v4/latest/USD').then(res => res.json())
        ])
        
        setParts(partData)
        setFilteredParts(partData)
        if (exchangeData?.rates?.INR) {
          setExchangeRate(exchangeData.rates.INR)
        }
      } catch (e) {
        console.error("Data sync error", e)
      }
    }
    
    fetchData()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const results = parts.filter((part) =>
      part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const formatPrice = (price?: number) => {
    if (!price) return 'Quote';
    if (currency === 'USD') {
      const usdPrice = price / exchangeRate;
      return `$${usdPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  }

  const whatsappNumber = "919600038089"

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER WITH SEARCH & CURRENCY SWITCH */}
      <nav style={navStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} />
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* SEARCH BAR */}
          <input 
            type="text" 
            placeholder="Search Inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle} 
          />

          {/* CURRENCY SWITCHER */}
          <div style={switcherContainer}>
            <button 
              onClick={() => setCurrency('INR')} 
              style={currency === 'INR' ? activeToggle : inactiveToggle}
            >INR</button>
            <button 
              onClick={() => setCurrency('USD')} 
              style={currency === 'USD' ? activeToggle : inactiveToggle}
            >USD</button>
          </div>

          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>HUB</Link>
        </div>
      </nav>

      {/* MAIN TABLE AREA */}
      <main style={{ padding: isMobile ? '20px 10px' : '40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#001a35', fontWeight: '900', margin: 0 }}>AIRCRAFT COMPONENT MARKETPLACE</h1>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {filteredParts.length} Items Found | 1 USD = {exchangeRate.toFixed(2)} INR
          </div>
        </div>
        
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ backgroundColor: '#001a35', color: 'white', textAlign: 'left' }}>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>DESCRIPTION</th>
                <th style={thStyle}>MODEL/CAT</th>
                <th style={thStyle}>CONDITION</th>
                <th style={thStyle}>LOCATION</th>
                <th style={thStyle}>STATUS</th>
                <th style={thStyle}>UNIT PRICE</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part) => (
                <tr key={part._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}><b>{part.partNumber}</b></td>
                  <td style={tdStyle}>{part.description}</td>
                  <td style={tdStyle}>{part.category || 'General'}</td>
                  <td style={tdStyle}>{part.condition || 'New'}</td>
                  <td style={tdStyle}>{part.location || 'Chennai'}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      color: part.stockStatus === 'OUT OF STOCK' ? '#ef4444' : '#10b981',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {part.stockStatus || 'AVAILABLE'}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatPrice(part.price)}</td>
                  <td style={tdStyle}>
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=RFQ:%20PN%20${part.partNumber}%20(${part.description})`}
                      target="_blank"
                      style={inquireButtonStyle}
                    >
                      INQUIRE
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SOURCING REQUEST FORM */}
        <section id="rfq" style={sourcingFormStyle}>
          <h2 style={{ color: '#001a35', fontSize: '1.5rem', fontWeight: '800' }}>Can't find a specific part?</h2>
          <p style={{ color: '#64748b', marginBottom: '25px' }}>Submit a sourcing request and our Chennai desk will track it down globally.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Desired Part Number" style={inputStyle} />
            <input type="text" placeholder="Aircraft Model (e.g. C172)" style={inputStyle} />
            <button style={submitButtonStyle}>Submit Sourcing Request</button>
          </div>
        </section>
      </main>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#001a35' };
const searchBarStyle = { padding: '10px 20px', borderRadius: '4px', border: 'none', width: '250px', fontSize: '0.9rem', outline: 'none' };
const thStyle = { padding: '15px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' };
const tdStyle = { padding: '15px', fontSize: '0.85rem', color: '#001a35' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.7rem' };
const sourcingFormStyle = { marginTop: '60px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#001a35', color: '#ffb400', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' };

const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' };
const activeToggle = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '5px 10px', fontWeight: 'bold', fontSize: '0.7rem', cursor: 'pointer' };
const inactiveToggle = { backgroundColor: 'transparent', color: 'white', border: 'none', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer' };