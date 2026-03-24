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
  certificates?: string[];
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
  const [isAOG, setIsAOG] = useState(false)

  // FORM STATES
  const [formData, setFormData] = useState({
    buyerName: '',
    email: '',
    organization: '',
    tailNumber: '',
    partNumber: '',
    aircraft: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const whatsappNumber = "919600038089"; 

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    const query = `*[_type == "part"] | order(aircraftType asc)`
    async function initData() {
      setLoading(true)
      try {
        const data = await client.fetch(query)
        setParts(data || [])
        setFilteredParts(data || [])
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) setExchangeRate(rateData.rates.INR)
      } catch (e) { console.error("Sync Error:", e) }
      finally { setLoading(false) }
    }
    initData()

    const subscription = client.listen(query).subscribe((update) => {
      if (update) client.fetch(query).then(setParts)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      subscription.unsubscribe()
    }
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

  // 1. SELECT PART (AUTO-FILL)
  const handleInquire = (pn: string, model: string) => {
    setFormData(prev => ({ ...prev, partNumber: pn, aircraft: model }))
    document.getElementById('rfq')?.scrollIntoView({ behavior: 'smooth' })
  }

  // 2. HANDLE FORM SUBMISSION & RESET
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const response = await fetch("https://formspree.io/f/mdalbdqq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, priority: isAOG ? 'AOG' : 'Routine' }),
    })

    if (response.ok) {
      setShowSuccess(true)
      setIsAOG(false)
      // RESET FORM FIELDS
      setFormData({
        buyerName: '',
        email: '',
        organization: '',
        tailNumber: '',
        partNumber: '',
        aircraft: '',
        description: ''
      })
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
    }
    setIsSubmitting(false)
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>SYNCING JEDO CLOUD INVENTORY...</p></div>

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVIGATION */}
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

      {/* SYSTEM STATUS */}
      <div style={intelBar}>
        <div style={intelItem}><span style={pulseDot}></span> NETWORK: LIVE SYNC ACTIVE</div>
        <div style={intelItem}>RATE: 1 USD = {exchangeRate.toFixed(2)} INR</div>
        <div style={intelItem}>COMPLIANCE: DGCA / EASA / FAA</div>
      </div>

      <section style={{ padding: '60px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2.5rem', margin: '0 0 10px' }}>
          AIRCRAFT <span style={{ color: '#ffb400' }}>TYRE</span> INVENTORY
        </h1>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <input type="text" placeholder="Search PN or Model..." style={searchBarStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </section>

      <main style={{ padding: '20px 40px 80px', maxWidth: '1440px', margin: '0 auto', flex: 1 }}>
        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#001a35', color: 'white' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>TYRE SIZE</th>
                <th style={thStyle}>PLY</th>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>CONDITION</th>
                <th style={thStyle}>CERTIFICATION</th>
                <th style={thStyle}>UNIT PRICE</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part._id} style={trStyle}>
                  <td style={tdStyle}><b>{part.aircraftType}</b></td>
                  <td style={tdStyle}>{part.tyreSize}</td>
                  <td style={tdStyle}>{part.plyRating}P</td>
                  <td style={{ ...tdStyle, color: '#ffb400', fontWeight: '800', fontFamily: 'monospace' }}>{part.partNumber}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}>
                    <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                      {part.certificates?.map(cert => <span key={cert} style={docBadge}>{cert}</span>) || <span style={{...docBadge, opacity: 0.5}}>CoC</span>}
                    </div>
                  </td>
                  <td style={tdStyle}><b>{formatPrice(part.priceUSD)}</b></td>
                  <td style={{...tdStyle, display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <button onClick={() => handleInquire(part.partNumber, part.aircraftType)} style={inquireButtonStyle}>INQUIRE</button>
                    <a href={`https://wa.me/${whatsappNumber}?text=RFQ PN: ${part.partNumber}`} target="_blank" style={whatsappButtonStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. ENHANCED SOURCING CARD WITH AUTO-RESET */}
        <section id="rfq" style={{...formSectionStyle, border: isAOG ? '2px solid #ef4444' : '1px solid rgba(255,180,0,0.2)'}}>
          
          {showSuccess && (
            <div style={successBanner}>
               ✓ REQUEST SENT SUCCESSFULLY. OUR LOGISTICS TEAM WILL CONTACT YOU SHORTLY.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>
                SUBMIT <span style={{ color: isAOG ? '#ef4444' : '#ffb400' }}>{isAOG ? 'AOG' : 'SOURCING'}</span> REQUEST
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '30px' }}>
               <span style={{color: '#fff', fontSize: '0.7rem', fontWeight: 'bold'}}>AOG PRIORITY</span>
               <input type="checkbox" checked={isAOG} onChange={(e) => setIsAOG(e.target.checked)} style={{cursor: 'pointer'}} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} style={formGridStyle}>
            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}><label style={labelStyle}>Contact Person</label>
                <input value={formData.buyerName} onChange={(e)=>setFormData({...formData, buyerName: e.target.value})} type="text" placeholder="Full Name" required style={inputStyle} />
              </div>
              <div style={inputGroup}><label style={labelStyle}>Official Email</label>
                <input value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} type="email" placeholder="official@company.com" required style={emailInputStyle} />
              </div>
            </div>

            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}><label style={labelStyle}>Flight School / Company</label>
                <input value={formData.organization} onChange={(e)=>setFormData({...formData, organization: e.target.value})} type="text" placeholder="Organization" required style={inputStyle} />
              </div>
              <div style={inputGroup}><label style={labelStyle}>Tail Number</label>
                <input value={formData.tailNumber} onChange={(e)=>setFormData({...formData, tailNumber: e.target.value})} type="text" placeholder="e.g. VT-XXX" style={inputStyle} />
              </div>
            </div>

            <div style={isMobile ? fullCol : sideBySide}>
              <div style={inputGroup}><label style={labelStyle}>Part Number</label>
                <input value={formData.partNumber} onChange={(e)=>setFormData({...formData, partNumber: e.target.value})} type="text" placeholder="PN" style={inputStyle} />
              </div>
              <div style={inputGroup}><label style={labelStyle}>Model</label>
                <input value={formData.aircraft} onChange={(e)=>setFormData({...formData, aircraft: e.target.value})} type="text" placeholder="e.g. Cessna 172" required style={inputStyle} />
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={inputGroup}><label style={labelStyle}>Technical Remarks</label>
                <textarea value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} placeholder="Specify qty and paperwork needs..." required style={{...inputStyle, height: '80px'}} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
               <button type="submit" disabled={isSubmitting} style={{...submitButtonStyle, backgroundColor: isAOG ? '#ef4444' : '#ffb400'}}>
                 {isSubmitting ? 'SENDING...' : (isAOG ? 'INITIALIZE AOG DISPATCH' : 'SEND SOURCING REQUEST')}
               </button>
            </div>
          </form>
        </section>
      </main>

      <footer style={footerStyle}><p>© 2026 Jedo Technologies Pvt. Ltd. | DGCA & International Standards Compliance</p></footer>
    </div>
  )
}

// --- STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#001a35' } as const;
const navLinkStyle = { color: '#ffb400', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const currencySwitcherPill = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '4px', border: '1px solid rgba(255,180,0,0.3)' } as const;
const activePillBtn = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '8px 18px', borderRadius: '40px', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer' } as const;
const inactivePillBtn = { backgroundColor: 'transparent', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' } as const;
const intelBar = { display: 'flex', justifyContent: 'center', gap: '30px', padding: '10px', backgroundColor: '#001328', borderBottom: '1px solid rgba(255,180,0,0.2)', flexWrap: 'wrap' as const } as const;
const intelItem = { color: '#94a3b8', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const pulseDot = { display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px', boxShadow: '0 0 8px #10b981' } as const;
const searchBarStyle = { width: '100%', padding: '20px 40px', borderRadius: '100px', border: '2px solid #001a35', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } as const;
const tableWrapperStyle = { overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #001a35' } as const;
const thStyle = { padding: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' } as const;
const trStyle = { borderBottom: '1px solid #001a35' } as const;
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#001a35' } as const;
const badgeStyle = { backgroundColor: '#fff7e6', color: '#ffb400', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' } as const;
const docBadge = { fontSize: '0.6rem', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '3px', border: '1px solid #e2e8f0', fontWeight: 'bold' as const } as const;
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '10px 15px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' } as const;
const whatsappButtonStyle = { backgroundColor: '#25D366', color: 'white', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', cursor: 'pointer', textDecoration: 'none' } as const;
const formSectionStyle = { marginTop: '80px', backgroundColor: '#001a35', padding: '40px', borderRadius: '20px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', transition: 'all 0.3s ease' } as const;
const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const sideBySide = { display: 'flex', gap: '20px' } as const;
const fullCol = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 } as const;
const labelStyle = { color: '#ffb400', fontSize: '0.7rem', fontWeight: 'bold' } as const;
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none' } as const;
const emailInputStyle = { ...inputStyle, boxShadow: '0 0 0px 1000px #001a35 inset', WebkitTextFillColor: 'white', opacity: 0.8 } as const;
const submitButtonStyle = { color: '#001a35', padding: '15px 50px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' } as const;
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' } as const;
const footerStyle = { backgroundColor: '#000c17', color: 'rgba(255,255,255,0.3)', padding: '40px 20px', textAlign: 'center' as const, fontSize: '0.75rem' } as const;

// SUCCESS BANNER STYLE
const successBanner = { 
  backgroundColor: '#10b981', 
  color: 'white', 
  padding: '15px', 
  borderRadius: '8px', 
  marginBottom: '25px', 
  fontSize: '0.85rem', 
  fontWeight: 'bold', 
  textAlign: 'center' as const 
};