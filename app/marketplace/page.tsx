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

  const [selectedPartNumber, setSelectedPartNumber] = useState('')
  const [selectedAircraft, setSelectedAircraft] = useState('')

  const whatsappNumber = "919600038089"; 

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
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. NAVIGATION */}
      <nav style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '45px' }} /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <div style={currencySwitcherPill}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activePillBtn : inactivePillBtn}>USD</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activePillBtn : inactivePillBtn}>INR</button>
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
      <main style={{ padding: '20px 40px 80px', maxWidth: '1440px', margin: '0 auto', flex: 1 }}>
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
                  <td style={{...tdStyle, display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <button onClick={() => handleInquire(part.partNumber, part.aircraftType)} style={inquireButtonStyle}>INQUIRE</button>
                    <a href={`https://wa.me/${whatsappNumber}?text=RFQ for PN: ${part.partNumber}`} target="_blank" style={whatsappButtonStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. SOURCING CARD */}
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
                <input name="email" type="email" placeholder="official@company.com" required style={emailInputStyle} />
              </div>
            </div>

            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}>
                <label style={labelStyle}>Part Number</label>
                <input name="partNumber" type="text" value={selectedPartNumber} onChange={(e) => setSelectedPartNumber(e.target.value)} placeholder="Specify PN" style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Aircraft Model</label>
                <input name="aircraft" type="text" value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.target.value)} placeholder="e.g. Cessna 172" required style={inputStyle} />
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={inputGroup}>
                <label style={labelStyle}>Technical Requirements</label>
                <textarea name="description" placeholder="Specify requirements..." required style={{...inputStyle, height: '80px'}} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', width: '100%' }}>
               <button type="submit" style={submitButtonStyle}>SEND SOURCING REQUEST</button>
            </div>
          </form>
        </section>
      </main>

      {/* 5. UPDATED FOOTER - Matches Home Page exactly */}
      <footer style={footerStyle}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | DGCA & International Standards Compliance</p>
      </footer>
    </div>
  )
}

// --- STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#001a35', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' } as const;
const navLinkStyle = { color: '#ffb400', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const currencySwitcherPill = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '4px', border: '1px solid rgba(255,180,0,0.3)' } as const;
const activePillBtn = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '8px 18px', borderRadius: '40px', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer' } as const;
const inactivePillBtn = { backgroundColor: 'transparent', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' } as const;
const searchBarStyle = { width: '100%', padding: '20px 40px', borderRadius: '100px', border: '2px solid #001a35', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } as const;
const tableWrapperStyle = { overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #001a35' } as const;
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' } as const;
const trStyle = { borderBottom: '1px solid #001a35' } as const;
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' } as const;
const badgeStyle = { backgroundColor: '#fff7e6', color: '#ffb400', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' } as const;
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 15px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' } as const;
const whatsappButtonStyle = { backgroundColor: '#25D366', color: 'white', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', cursor: 'pointer', textDecoration: 'none' } as const;
const formSectionStyle = { marginTop: '80px', backgroundColor: '#001a35', padding: '40px', borderRadius: '20px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' } as const;
const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const sideBySide = { display: 'flex', gap: '20px' } as const;
const fullCol = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 } as const;
const labelStyle = { color: '#ffb400', fontSize: '0.7rem', fontWeight: 'bold' } as const;
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none' } as const;

// UPDATED: Subtle Placeholder Styling
const emailInputStyle = {
  ...inputStyle,
  boxShadow: '0 0 0px 1000px #001a35 inset', 
  WebkitTextFillColor: 'white',
  opacity: 0.8 // Makes the example/placeholder less "bright"
} as const;

const submitButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '15px 50px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' } as const;
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' } as const;

// UPDATED: Standard Corporate Footer (Matching Home Page)
const footerStyle = { 
  backgroundColor: '#000c17', 
  color: 'rgba(255,255,255,0.3)', 
  padding: '40px 20px', 
  textAlign: 'center' as const, 
  fontSize: '0.75rem' 
} as const;