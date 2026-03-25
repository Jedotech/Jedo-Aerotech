'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter();
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
        router.push('/success');
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getWhatsAppURL = (part: AviationPart) => {
    const message = `Hi Jedo Tech,%0A` +
                    `I am interested in the following component:%0A%0A` +
                    `*Part Number:* ${part.partNumber}%0A` +
                    `*Aircraft Model:* ${part.aircraftType}%0A` +
                    `*Quantity:* %0A` +
                    `*AOG Status:* %0A%0A` +
                    `Please provide availability and a quote.`;
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>SYNCING LIVE INVENTORY DATA...</p></div>

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* INJECTED CUSTOM SCROLLBAR CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffb400;
          border-radius: 10px;
          border: 2px solid #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e6a200;
        }
      `}</style>

      <nav style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <div style={currencySwitcherPill}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activePillBtn : inactivePillBtn}>USD</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activePillBtn : inactivePillBtn}>INR</button>
          </div>
        </div>
      </nav>

      <div style={intelBarCenter}>
        <div style={intelCapsule}>
          <div style={intelItem}><span style={pulseDot}></span> HUB: CHENNAI</div>
          <div style={intelDivider} />
          <div style={intelItem}>X-RATE: 1 USD = {exchangeRate.toFixed(2)} INR</div>
          <div style={intelDivider} />
          <div style={intelItem}>STANDARDS: DGCA / EASA / FAA</div>
        </div>
      </div>

      {/* CONTAINER SECTION WITH CONTRASTING BACKGROUND */}
      <section style={inventoryWrapper}>
        <div style={inventoryContentContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.8rem', margin: 0, letterSpacing: '-0.5px' }}>
                TYRE <span style={{ color: '#ffb400' }}>INVENTORY</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px' }}>Real-time technical asset database</p>
            </div>
            <input type="text" placeholder="Search P/N or Model..." style={searchBarStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div style={whiteSection}>
            <div className="custom-scrollbar" style={tableWrapperStyle}>
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
          </div>
        </div>
      </section>

      <section id="rfq" style={navySection}>
        <div style={formContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ color: '#ffb400', fontWeight: '900', fontSize: '1.5rem', margin: 0 }}>
                GLOBAL <span style={{ color: '#ffffff' }}>SOURCING HUB</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Request components not currently listed in manifest</p>
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
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="ops@airline.com" required style={emailInputStyle} />
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
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Specify quantity, certification requirements (8130/DGCA), and AOG deadline..." required style={{ ...navyInput, height: '80px' }} />
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

// --- VISUAL POLISH STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 60px', backgroundColor: '#001a35', borderBottom: '1px solid rgba(255,180,0,0.2)' } as const;
const navLinkStyle = { color: '#ffb400', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const currencySwitcherPill = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px', border: '1px solid rgba(255,180,0,0.3)' } as const;
const activePillBtn = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '5px 12px', borderRadius: '2px', fontWeight: '900', fontSize: '0.65rem', cursor: 'pointer' } as const;
const inactivePillBtn = { backgroundColor: 'transparent', color: '#ffffff', border: 'none', padding: '5px 12px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' } as const;

const intelBarCenter = { display: 'flex', justifyContent: 'center', padding: '20px 60px', backgroundColor: '#f1f5f9' } as const;
const intelCapsule = { display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 30px', backgroundColor: '#ffffff', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' } as const;
const intelItem = { color: '#64748b', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.5px' } as const;
const intelDivider = { width: '1px', height: '14px', backgroundColor: '#e2e8f0' } as const;
const pulseDot = { display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' } as const;

// New Inventory Wrapper for pop-out effect
const inventoryWrapper = { backgroundColor: '#0f172a', padding: '60px 0' } as const;
const inventoryContentContainer = { maxWidth: '1440px', margin: '0 auto', padding: '0 60px' } as const;

// Table Card Styling
const whiteSection = { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' } as const;
const searchBarStyle = { width: '320px', padding: '12px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', outline: 'none', color: '#ffffff' } as const;

const tableWrapperStyle = { 
  width: '100%', 
  overflowX: 'auto' as const,
  maxHeight: '600px', 
  overflowY: 'auto' as const, 
} as const;

const thStyle = { 
  padding: '18px 20px', 
  fontSize: '0.65rem', 
  fontWeight: '900', 
  letterSpacing: '1px',
  position: 'sticky' as const, 
  top: 0,
  backgroundColor: '#001a35',
  zIndex: 1,
} as const;

const trStyle = { borderBottom: '1px solid #f1f5f9' } as const;
const tdStyle = { padding: '18px 20px', fontSize: '0.8rem', color: '#334155' } as const;
const badgeStyle = { color: '#001a35', fontSize: '0.75rem', fontWeight: 'bold' } as const;
const docBadge = { fontSize: '0.6rem', background: '#001a35', color: '#fff', padding: '2px 6px', borderRadius: '2px', fontWeight: 'bold' } as const;

const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '8px 16px', borderRadius: '4px', border: 'none', fontWeight: 'bold', fontSize: '0.7rem', cursor: 'pointer' } as const;
const whatsappButtonStyle = { backgroundColor: '#25D366', color: 'white', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: 'none', cursor: 'pointer', textDecoration: 'none' } as const;

const navySection = { backgroundColor: '#001a35', padding: '80px 60px' } as const;
const formContainer = { maxWidth: '1200px', margin: '0 auto' } as const;
const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const gridRow3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' } as const;
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const navyLabel = { color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' } as const;
const navyInput = { padding: '14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', fontSize: '0.9rem', outline: 'none' } as const;
const emailInputStyle = { ...navyInput, boxShadow: '0 0 0px 1000px #001a35 inset' } as const;

const submitButtonStyle = { padding: '16px 50px', borderRadius: '6px', border: 'none', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s' } as const;
const footerStyle = { backgroundColor: '#000c17', color: 'rgba(255,255,255,0.2)', padding: '40px 20px', textAlign: 'center' as const, fontSize: '0.7rem' } as const;
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold' } as const;