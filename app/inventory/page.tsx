'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. SANITY CLIENT CONFIGURATION
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function InventoryPage() {
  const [parts, setParts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  // 2. CURRENCY STATE (Default to INR)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const exchangeRate = 83.5; // Update periodically based on market

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const query = `*[_type == "part"] | order(aircraftType asc) {
          _id,
          aircraftType,
          gearPosition,
          partNumber,
          plyRating,
          priceUSD, 
          quantity,
          warehouse
        }`
        const data = await client.fetch(query)
        setParts(data)
      } catch (error) {
        console.error("Inventory Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchParts()
  }, [])

  // 3. SEARCH FILTER LOGIC
  const filteredParts = parts.filter((part) => 
    part.aircraftType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.gearPosition?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 4. PRICE FORMATTING WITH "EST." AND FALLBACK
  const formatPrice = (usdAmount: number) => {
    if (!usdAmount || usdAmount === 0) return "Contact for Quote";

    const isINR = currency === 'INR';
    const finalValue = isINR ? usdAmount * exchangeRate : usdAmount;

    return `Est. ${new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', { 
      style: 'currency', 
      currency: currency, 
      maximumFractionDigits: 0 
    }).format(finalValue)}`;
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVIGATION WITH CONVERTER */}
      <nav className="nav-container" style={navStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo Tech" style={{ height: '40px' }} /></Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={toggleContainer}>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activeToggle : inactiveToggle}>₹ INR</button>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activeToggle : inactiveToggle}>$ USD</button>
          </div>
          <Link href="/inventory" style={{ color: '#ffb400', fontWeight: 'bold', textDecoration: 'none' }}>MARKETPLACE</Link>
        </div>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#002d5b', fontSize: '3rem', fontWeight: '900', margin: 0 }}>Tyre Marketplace</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Global sourcing intelligence for training aircraft fleets.</p>
        
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Search by aircraft model, gear position, or size..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle}
          />
        </div>

        <div style={tableWrapper}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Aircraft Model</th>
                <th style={thStyle}>Gear Position</th>
                <th style={thStyle}>Tyre Size / P/N</th>
                <th style={thStyle}>Ply</th>
                <th style={thStyle}>Est. Cost ({currency})</th>
                <th style={thStyle}>Sourcing Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>Syncing Global Markets...</td></tr>
              ) : filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <tr key={part._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}><strong>{part.aircraftType}</strong></td>
                    <td style={tdStyle}><span style={gearBadgeStyle}>{part.gearPosition || 'Main'}</span></td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold' }}>{part.partNumber}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={plyBadgeStyle}>{part.plyRating || 'N/A'}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '900', color: '#002d5b', fontSize: '1.1rem' }}>
                        {formatPrice(part.priceUSD)}
                      </span>
                      <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '4px' }}>
                        *Excl. Customs/GST
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ color: part.quantity > 0 ? '#16a34a' : '#64748b', fontWeight: 'bold' }}>
                        {part.quantity > 0 ? 'Ready to Ship' : 'Available to Source'}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        Hub: {part.warehouse || 'Global'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <Link 
                        href={`/#rfq?part=${encodeURIComponent(part.partNumber)}`} 
                        style={tableButtonStyle}
                      >
                        GET QUOTE
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} style={{ padding: '80px', textAlign: 'center' }}>No matching tyres found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

// STYLING
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const toggleContainer = { display: 'flex', backgroundColor: '#001a35', borderRadius: '20px', padding: '4px' };
const activeToggle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' as const };
const inactiveToggle = { backgroundColor: 'transparent', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', opacity: 0.6 };
const searchBarStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #002d5b', fontSize: '1rem', fontWeight: 'bold' as const };
const tableWrapper = { borderRadius: '12px', border: '2px solid #002d5b', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const thStyle = { padding: '15px', fontSize: '0.8rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const tdStyle = { padding: '15px', fontSize: '0.9rem', verticalAlign: 'middle' as const };
const tableButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '10px 18px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' as const };
const plyBadgeStyle = { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem' };
const gearBadgeStyle = { backgroundColor: '#e2e8f0', color: '#002d5b', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem', textTransform: 'uppercase' as const };