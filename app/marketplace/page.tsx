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

  const handleInquire = (pn: string, model: string) => {
    setFormData(prev => ({ ...prev, partNumber: pn, aircraft: model }))
    document.getElementById('rfq')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("https://formspree.io/f/mdalbdqq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, priority: isAOG ? 'AOG' : 'Routine' }),
      })
      if (response.ok) {
        setShowSuccess(true)
        setIsAOG(false)
        setFormData({ buyerName: '', email: '', organization: '', tailNumber: '', partNumber: '', aircraft: '', description: '' })
        setTimeout(() => setShowSuccess(false), 10000)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>ESTABLISHING SECURE CONNECTION...</p></div>

  return (
    <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. NAVIGATION */}
      <nav style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '42px' }} /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <div style={currencySwitcherPill}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activePillBtn : inactivePillBtn}>USD</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activePillBtn : inactivePillBtn}>INR</button>
          </div>
        </div>
      </nav>

      {/* 2. CENTERED SYSTEM STATUS */}
      <div style={intelBarCenter}>
        <div style={intelCapsule}>
          <div style={intelItem}><span style={pulseDot}></span> HUB: CHENNAI</div>
          <div style={intelDivider} />
          <div style={intelItem}>X-RATE: 1 USD = {exchangeRate.toFixed(2)} INR</div>
          <div style={intelDivider} />
          <div style={intelItem}>COMPLIANCE: DGCA / EASA / FAA</div>
        </div>
      </div>

      {/* 3. INVENTORY SECTION - REDESIGNED FOR BOLDNESS */}
      <section style={manifestSection}>
        <div style={manifestHeader}>
          <div>
            <h1 style={manifestTitle}>
              INVENTORY <span style={{ color: '#ffb400' }}>MANIFEST</span>
            </h1>
            <p style={manifestSubtitle}>Certified Technical Asset Database</p>
          </div>
          <div style={searchContainer}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Filter by Part Number or Aircraft Model..." 
              style={searchBarStyle} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={tableHeaderRow}>
                <th style={thStyleBold}>AIRCRAFT MODEL</th>
                <th style={thStyleBold}>SIZE</th>
                <th style={thStyleBold}>PLY</th>
                <th style={thStyleBold}>PART NUMBER</th>
                <th style={thStyleBold}>CONDITION</th>
                <th style={thStyleBold}>CERTIFICATION</th>
                <th style={thStyleBold}>UNIT PRICE</th>
                <th style={thStyleBold}>PROCUREMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part, index) => (
                <tr key={part._id} style={index % 2 === 0 ? trStyleLight : trStyleZebra}>
                  <td style={tdStyle}><b>{part.aircraftType}</b></td>
                  <td style={tdStyle}>{part.tyreSize}</td>
                  <td style={tdStyle}>{part.plyRating}P</td>
                  <td style={partNumberCell}>{part.partNumber}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}>
                    <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                      {part.certificates?.map(cert => <span key={cert} style={docBadgeActive}>{cert}</span>) || <span style={docBadgeCoC}>CoC Only</span>}
                    </div>
                  </td>
                  <td style={tdStyle}><b style={{color: '#001a35'}}>{formatPrice(part.priceUSD)}</b></td>
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
      </section>

      {/* 4. SOURCING SECTION */}
      <section id="rfq" style={navySection}>
        <div style={formContainer}>
          {showSuccess && (
            <div style={successBanner}>
              <div style={{ marginBottom: '5px' }}>✓ PROCUREMENT REQUEST TRANSMITTED</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Logged in Chennai Command Center. Redirecting Desk...</div>
              <div style={countdownLine} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ color: '#ffb400', fontWeight: '900', fontSize: '1.5rem', margin: 0 }}>
                GLOBAL <span style={{ color: '#ffffff' }}>SOURCING HUB</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Submit requirements for non-listed components</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isAOG ? '#ef4444' : 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '4px', transition: '0.3s' }}>
              <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: '900' }}>AOG PRIORITY</span>
              <input type="checkbox" checked={isAOG} onChange={(e) => setIsAOG(e.target.checked)} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={formGridStyle}>
            <div style={gridRow3}>
              <div style={inputGroup}><label style={navyLabel}>PERSONNEL</label>
                <input value={formData.buyerName} onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })} type="text" placeholder="Contact Name" required style={navyInput} />
              </div>
              <div style={inputGroup}><label style={navyLabel}>OFFICIAL EMAIL</label>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="ops@airline.com" required style={navyInput} />
              </div>
              <div style={inputGroup}><label style={navyLabel}>ORGANIZATION</label>
                <input value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} type="text" placeholder="Flight School / MRO" required style={navyInput} />
              </div>
            </div>

            <div style={gridRow3}>
              <div style={inputGroup}><label style={navyLabel}>AIRCRAFT TYPE</label>
                <input value={formData.aircraft} onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })} type="text" placeholder="e.g. C172" required style={navyInput} />
              </div>
              <div style={inputGroup}><label style={navyLabel}>PART NUMBER</label>
                <input value={formData.partNumber} onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })} type="text" placeholder="Required P/N" style={navyInput} />
              </div>
              <div style={inputGroup}><label style={navyLabel}>TAIL NUMBER</label>
                <input value={formData.tailNumber} onChange={(e) => setFormData({ ...formData, tailNumber: e.target.value })} type="text" placeholder="VT-XXX" style={navyInput} />
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={inputGroup}><label style={navyLabel}>TECHNICAL SPECIFICATIONS</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Specify quantity, certification requirements, and AOG deadline..." required style={{ ...navyInput, height: '80px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" disabled={isSubmitting} style={{ ...submitButtonStyle, backgroundColor: isAOG ? '#ef4444' : '#ffb400', color: '#001a35' }}>
                {isSubmitting ? 'TRANSMITTING...' : (isAOG ? 'INITIALIZE AOG DISPATCH' : 'SUBMIT PROCUREMENT REQUEST')}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer style={footerStyle}><p>© 2026 Jedo Technologies Pvt. Ltd. | DGCA & International Standards Compliance</p></footer>
    </div>
  )
}

// --- NEW DESIGN SYSTEM STYLES ---

const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#001a35', borderBottom: '2px solid #ffb400' } as const;
const navLinkStyle = { color: '#ffffff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const currencySwitcherPill = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px' } as const;
const activePillBtn = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '6px 14px', borderRadius: '2px', fontWeight: '900', fontSize: '0.65rem', cursor: 'pointer' } as const;
const inactivePillBtn = { backgroundColor: 'transparent', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' } as const;

// Centered Command Bar
const intelBarCenter = { display: 'flex', justifyContent: 'center', padding: '20px 60px', backgroundColor: '#f4f7f9' } as const;
const intelCapsule = { display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 30px', backgroundColor: '#ffffff', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' } as const;
const intelItem = { color: '#475569', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px' } as const;
const intelDivider = { width: '1px', height: '14px', backgroundColor: '#e2e8f0' } as const;
const pulseDot = { display: 'inline-block', width: '7px', height: '7px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px', boxShadow: '0 0 8px #10b981' } as const;

// Manifest Redesign
const manifestSection = { backgroundColor: '#ffffff', margin: '0 60px 60px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,26,53,0.08)', overflow: 'hidden', border: '1px solid #e2e8f0' } as const;
const manifestHeader = { padding: '40px 40px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' } as const;
const manifestTitle = { color: '#001a35', fontWeight: '900', fontSize: '2.2rem', margin: 0, letterSpacing: '-1px' } as const;
const manifestSubtitle = { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1px', marginTop: '4px' } as const;
const searchContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0 20px', borderRadius: '8px', border: '1px solid #e2e8f0' } as const;
const searchBarStyle = { width: '350px', padding: '15px 0', border: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', outline: 'none', color: '#001a35' } as const;

// Table Refinements
const tableHeaderRow = { backgroundColor: '#001a35' } as const;
const tableWrapperStyle = { width: '100%', overflowX: 'auto' } as const;
const thStyleBold = { padding: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px', color: '#ffb400', textTransform: 'uppercase' as const } as const;
const trStyleLight = { backgroundColor: '#ffffff', transition: '0.2s' } as const;
const trStyleZebra = { backgroundColor: '#fcfdfe', transition: '0.2s' } as const;
const tdStyle = { padding: '20px', fontSize: '0.85rem', color: '#334155', borderBottom: '1px solid #f1f5f9' } as const;
const partNumberCell = { padding: '20px', fontSize: '0.9rem', color: '#001a35', fontWeight: '800', fontFamily: 'monospace', borderBottom: '1px solid #f1f5f9' } as const;

// Badges
const badgeStyle = { backgroundColor: '#001a35', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' } as const;
const docBadgeActive = { fontSize: '0.6rem', background: '#ffb400', color: '#001a35', padding: '3px 8px', borderRadius: '4px', fontWeight: '900' } as const;
const docBadgeCoC = { fontSize: '0.6rem', background: '#f1f5f9', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' } as const;

// Buttons
const inquireButtonStyle = { backgroundColor: '#001a35', color: '#ffb400', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '900', fontSize: '0.7rem', cursor: 'pointer' } as const;
const whatsappButtonStyle = { backgroundColor: '#25D366', color: 'white', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', cursor: 'pointer', textDecoration: 'none' } as const;

// Hub Styles
const navySection = { backgroundColor: '#001a35', padding: '100px 60px' } as const;
const formContainer = { maxWidth: '1200px', margin: '0 auto' } as const;
const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const gridRow3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' } as const;
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const navyLabel = { color: '#ffb400', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' } as const;
const navyInput = { padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' } as const;
const submitButtonStyle = { padding: '18px 60px', borderRadius: '8px', border: 'none', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer' } as const;

const footerStyle = { backgroundColor: '#000c17', color: 'rgba(255,255,255,0.3)', padding: '50px 20px', textAlign: 'center' as const, fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' } as const;
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' } as const;

// Success & Animation
const successBanner = { backgroundColor: '#10b981', color: 'white', padding: '25px', borderRadius: '12px', marginBottom: '40px', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' } as const;
const countdownLine = { position: 'absolute' as const, bottom: 0, left: 0, height: '5px', backgroundColor: 'rgba(255,255,255,0.6)', width: '100%', animation: 'shrink 10s linear forwards' } as const;