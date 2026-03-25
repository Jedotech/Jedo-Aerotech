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

  // STRUCTURED WHATSAPP MESSAGE GENERATOR
  const getWhatsAppURL = (part: AviationPart) => {
    const message = `Hi Jedo Tech,\n\nI am interested in the following component:\n\n*Part Number:* ${part.partNumber}\n*Aircraft Model:* ${part.aircraftType}\n*Quantity:* 1\n*AOG Status:* ${isAOG ? "YES" : "NO"}\n\nPlease provide availability and a quote.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>ESTABLISHING SECURE CONNECTION...</p></div>

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. NAVIGATION */}
      <nav style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <div style={currencySwitcherPill}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activePillBtn : inactivePillBtn}>USD</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activePillBtn : inactivePillBtn}>INR</button>
          </div>
        </div>
      </nav>

      {/* 2. SYSTEM STATUS */}
      <div style={intelBar}>
        <div style={intelItem}><span style={pulseDot}></span> HUB: CHENNAI</div>
        <div style={intelItem}>X-RATE: 1 USD = {exchangeRate.toFixed(2)} INR</div>
        <div style={intelItem}>STANDARDS: DGCA / EASA / FAA</div>
      </div>

      {/* 3. INVENTORY SECTION */}
      <section style={whiteSection}>
        <div style={{ padding: '40px 60px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '1.8rem', margin: 0, letterSpacing: '-0.5px' }}>
              INVENTORY <span style={{ color: '#ffb400' }}>MANIFEST</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Real-time availability for training fleet components</p>
          </div>
          <input type="text" placeholder="Search P/N or Model..." style={searchBarStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#001a35', color: 'white' }}>
                <th style={thStyle}>AIRCRAFT MODEL</th>
                <th style={thStyle}>SIZE</th>
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
                  <td style={{ ...tdStyle, color: '#001a35', fontWeight: '700', fontFamily: 'monospace' }}>{part.partNumber}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{part.condition}</span></td>
                  <td style={tdStyle}>
                    <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                      {part.certificates?.map(cert => <span key={cert} style={docBadge}>{cert}</span>) || <span style={{...docBadge, opacity: 0.5}}>CoC</span>}
                    </div>
                  </td>
                  <td style={tdStyle}><b>{formatPrice(part.priceUSD)}</b></td>
                  <td style={{...tdStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <button onClick={() => handleInquire(part.partNumber, part.aircraftType)} style={inquireButtonStyle}>INQUIRE</button>
                    <a href={getWhatsAppURL(part)} target="_blank" style={whatsappButtonStyle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
              <div style={{ marginBottom: '5px' }}>✓ REQUEST TRANSMITTED SUCCESSFULLY</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Our logistics desk in Chennai has been notified.</div>
              <div style={countdownLine} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ color: '#ffb400', fontWeight: '900', fontSize: '1.5rem', margin: 0 }}>
                GLOBAL <span style={{ color: '#ffffff' }}>SOURCING HUB</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Request parts not listed in the current manifest</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isAOG ? '#ef4444' : 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '4px', transition: '0.3s' }}>
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
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Specify quantity, certification requirements (8130/DGCA), and AOG deadline..." required style={{