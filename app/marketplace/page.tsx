'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production', // Selling inventory usually stays in production
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function Marketplace() {
  const [parts, setParts] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function fetchParts() {
      // Fetching inventory from your 'part' or 'tyre' schema
      const query = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        price,
        condition,
        stockStatus,
        "imageUrl": image.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setParts(data)
      } catch (e) {
        console.error("Marketplace fetch error", e)
      }
    }
    fetchParts()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const whatsappNumber = "919600038089"

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <nav style={navStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} />
        </Link>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>
          ← BACK TO HUB
        </Link>
      </nav>

      {/* PAGE TITLE */}
      <div style={{ padding: isMobile ? '40px 20px' : '60px 20px', textAlign: 'center', backgroundColor: '#001a35', color: 'white' }}>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '800', margin: 0 }}>AIRCRAFT TYRE MARKETPLACE</h1>
        <p style={{ opacity: 0.7, marginTop: '10px' }}>Certified Inventory | Ready for Dispatch</p>
      </div>

      {/* INVENTORY GRID */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '25px' 
        }}>
          {parts.length > 0 ? parts.map((part: any) => (
            <div key={part._id} style={cardStyle}>
              <div style={badgeStyle(part.stockStatus)}>{part.stockStatus || 'AVAILABLE'}</div>
              <img 
                src={part.imageUrl || '/tyre-placeholder.png'} 
                alt={part.description} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>PN: {part.partNumber}</span>
                <h3 style={{ fontSize: '1.2rem', color: '#001a35', margin: '5px 0 15px' }}>{part.description}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: '#94a3b8' }}>UNIT PRICE</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#001a35' }}>₹{part.price || 'Contact'}</span>
                  </div>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=RFQ%20for%20PN:%20${part.partNumber}%20(${part.description})`}
                    target="_blank"
                    style={buyButtonStyle}
                  >
                    INQUIRE
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#64748b' }}>Updating live inventory...</p>
          )}
        </div>
      </main>

      {/* MOBILE RFQ FOOTER */}
      {isMobile && (
        <div style={mobileStickyFooter}>
          <a href={`https://wa.me/${whatsappNumber}?text=General%20Sourcing%20Inquiry`} style={mobileWhatappButton}>
            CHAT WITH LOGISTICS DESK
          </a>
        </div>
      )}
    </div>
  )
}

// STYLES
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '15px 25px', 
  backgroundColor: '#001a35', 
  borderBottom: '1px solid rgba(255,255,255,0.1)' 
}

const cardStyle = { 
  backgroundColor: 'white