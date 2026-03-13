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
  
  // 2. CURRENCY STATE (Default to INR for Chennai clients)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const exchangeRate = 83.5; 

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const query = `*[_type == "part"] | order(_createdAt desc) {
          _id,
          partNumber,
          aircraftType,
          plyRating,
          condition,
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
    part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.aircraftType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.plyRating?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 4. PRICE FORMATTING LOGIC
  const formatPrice = (usdAmount: number) => {
    if (!usdAmount) return "Contact for Quote";
    if (currency === 'INR') {
      const inrValue = usdAmount * exchangeRate;
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inrValue);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdAmount);
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

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#002d5b', fontSize: '3rem', fontWeight: '900', margin: 0 }}>Tyre Marketplace</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Global sourcing intelligence for training aircraft fleets.</p>
        
        <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Search size, ply, or aircraft model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle}
          />
        </div>

        {/* UPDATED TABLE WITH PLY RATING COLUMN */}
        <div style={tableWrapper}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002d5b', color: '#ffb400', textAlign: 'left' }}>
                <th style={thStyle}>Part / Size</th>
                <th style={thStyle}>Ply Rating</th>
                <th style={thStyle}>Fleet</th>
                <th style={thStyle}>Est. Price ({currency})</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Loading Global Data...</td></tr>
              ) : filteredParts.map((part) => (
                <tr key={part._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}><strong>{part.partNumber}</strong></td>
                  <td style={tdStyle}>
                    <span style={plyBadgeStyle}>
                      {part.plyRating || 'N/A'}
                    </span>
                  </td>
                  <td style={tdStyle}>{part.aircraftType}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 'bold', color: '#002d5b' }}>
                      {formatPrice(part.priceUSD)}
                    </span>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>*Excl. Customs/GST</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: part.quantity > 0 ? '#16a34a' : '#64748b', fontWeight: 'bold' }}>
                      {part.quantity > 0 ? 'Ready Hub' : 'Sourcing Required'}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {part.warehouse || 'Global'}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <Link href={`/#rfq?part=${part.partNumber}`} style={tableButtonStyle}>GET QUOTE</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

// STYLES
const toggleContainer = { display: 'flex', backgroundColor: '#001a35', borderRadius: '20px', padding: '4px' };
const activeToggle = { backgroundColor: '#ffb400', color: '#002d5b', border: 'none', padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' as const };
const inactiveToggle = { backgroundColor: 'transparent', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', opacity: 0.6 };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const searchBarStyle = { flex: 1, padding: '15px', borderRadius: '8px', border: '2px solid #002d5b', fontSize: '1rem', fontWeight: 'bold' as const };
const tableWrapper = { borderRadius: '12px', border: '2px solid #002d5b', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const thStyle = { padding: '15px', fontSize: '0.8rem', textTransform: 'uppercase' as const };
const tdStyle = { padding: '15px', fontSize: '0.9rem' };
const tableButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' as const };
const plyBadgeStyle = { backgroundColor: '#e2e8f0', color: '#002d5b', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.8rem' };