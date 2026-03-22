'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, critical: 0 })

  useEffect(() => {
    async function fetchData() {
      const query = `{
        "parts": *[_type == "part"] | order(_createdAt desc) {
          _id, aircraftType, gearPosition, tyreSize, partNumber,
          plyRating, priceUSD, quantity, warehouse,
          "totalLandings": coalesce(totalLandings, 0),
          "maxLife": coalesce(maxDesignLife, 350)
        },
        "totalCount": count(*[_type == "part"]),
        "criticalCount": count(*[_type == "part" && totalLandings >= maxDesignLife * 0.85])
      }`
      try {
        const data = await client.fetch(query)
        setParts(data.parts)
        setStats({ total: data.totalCount, critical: data.criticalCount })
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const exchangeRate = 83.5;
  const fleetHealth = stats.total > 0 ? Math.round(((stats.total - stats.critical) / stats.total) * 100) : 100;

  const filteredParts = parts.filter((part) => {
    const searchStr = `${part.aircraftType || ''} ${part.tyreSize || ''} ${part.partNumber || ''} ${part.gearPosition || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={switcherContainer}>
            <button onClick={() => setCurrency('INR')} style={{...switchBtn, backgroundColor: currency === 'INR' ? '#ffb400' : 'transparent', color: currency === 'INR' ? '#002d5b' : 'white'}}>INR</button>
            <button onClick={() => setCurrency('USD')} style={{...switchBtn, backgroundColor: currency === 'USD' ? '#ffb400' : 'transparent', color: currency === 'USD' ? '#002d5b' : 'white'}}>USD</button>
          </div>
          <a href="#marketplace" style={quoteButtonStyle}>MARKETPLACE</a>
          <a href="#rfq" style={quoteButtonStyle}>REQUEST SOURCING</a>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', fontWeight: '600', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9 }}>
            Specialized brokerage for Cessna & Piper components. We source, verify, and deliver certified aviation tyres directly to your hangar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a href="#marketplace" style={primaryButtonStyle}>Browse Marketplace</a>
            <Link href="https://jedo-fleet-intel.vercel.app" style={secondaryButtonStyle}>Fleet Intel Login</Link>
          </div>
        </div>
      </section>

      {/* 3. LIVE ASSET PULSE (RESTORED SECTION) */}
      <section style={{ backgroundColor: '#002d5b', padding: '40px 20px', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>TOTAL TRACKED ASSETS</span>
            <span style={statValueStyle}>{stats.total} Units</span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>FLEET HEALTH RATING</span>
            <span style={statValueStyle}>{fleetHealth}%</span>
          </div>
          <div style={{...statCardStyle, backgroundColor: '#ffb400', border: 'none'}}>
            <span style={{...statLabelStyle, color: '#002d5b'}}>SOURCING HUB STATUS</span>
            <span style={{...statValueStyle, color: '#002d5b'}}>CHENNAI LIVE</span>
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE SECTION */}
      <section id="marketplace" style={{ padding: '100px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#002d5b', marginBottom: '10px' }}>Tyre Marketplace</h2>
        <p style={{ color: '#64748b', marginBottom: '40px' }}>Live sourcing intelligence from Chennai & Singapore hubs.</p>

        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Search by aircraft model, gear position, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchFieldStyle}
          />
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>MODEL</th>
                <th style={thStyle}>GEAR</th>
                <th style={thStyle}>SIZE</th>
                <th style={thStyle}>PART NUMBER</th>
                <th style={thStyle}>PLY</th>
                <th style={thStyle}>EST. COST ({currency})</th>
                <th style={thStyle}>STATUS</th>
                <th style={thStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center' }}>Syncing Global Hubs...</td></tr>
              ) : filteredParts.map((part: any) => (
                <tr key={part._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                  <td style={tdStyle}><span style={badgeStyle}>{(part.gearPosition || 'MAIN').toUpperCase()}</span></td>
                  <td style={tdStyle}><strong>{part.tyreSize}</strong></td>
                  <td style={tdStyle}><code style={{ color: '#64748b' }}>{part.partNumber}</code></td>
                  <td style={tdStyle}>{part.plyRating}-Ply</td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#002d5b' }}>
                      {part.priceUSD ? (currency === 'INR' ? `₹${Math.round(part.priceUSD * exchangeRate).toLocaleString('en-IN')}` : `$${part.priceUSD}`) : 'Quote Req'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#16a34a', fontWeight: '900' }}>In Stock</div>
                    <div style={{ fontSize: '0.7rem' }}>{part.warehouse}</div>
                  </td>
                  <td style={tdStyle}><a href="#rfq" style={tableBtnStyle}>GET QUOTE</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={{ backgroundColor: '#002d5b', color: 'white', padding: '60px', textAlign: 'center' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Aviation Tyre Intelligence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const heroSectionStyle = { minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.7), rgba(0,45,91,0.7)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const statCardStyle = { padding: '25px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const statLabelStyle = { fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: '#ffb400', marginBottom: '5px' };
const statValueStyle = { fontSize: '2rem', fontWeight: '900', color: 'white' };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const };
const secondaryButtonStyle = { backgroundColor: 'transparent', border: '2px solid white', color: 'white', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const };
const switcherContainer = { display: 'flex', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '2px' };
const switchBtn = { border: 'none', padding: '6px 15px', borderRadius: '18px', fontSize: '0.75rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.8rem' };
const searchFieldStyle = { width: '100%', padding: '18px 25px', borderRadius: '10px', border: '2px solid #002d5b', fontSize: '1rem', outline: 'none' };
const thStyle = { padding: '15px', fontSize: '0.7rem' };
const tdStyle = { padding: '20px', color: '#002d5b' };
const badgeStyle = { backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' };
const tableBtnStyle = { backgroundColor: '#002d5b', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '900', fontSize: '0.8rem' };