'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. TYPE-SAFE INTERFACE
interface AviationPart {
  _id: string;
  partNumber: string;
  description: string;
  price?: number;
  condition?: string;
  stockStatus?: string;
  category?: string;
  imageUrl?: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

// REMOVED viewport and metadata exports from here. 
// They should live in a separate layout.tsx or be removed if defined in your root layout.

export default function Marketplace() {
  const [parts, setParts] = useState<AviationPart[]>([])
  const [filteredParts, setFilteredParts] = useState<AviationPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isMobile, setIsMobile] = useState(false)

  const categories = ['All', 'Cessna 172', 'Cessna 152', 'Piper', 'Main Gear', 'Nose Gear']

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function fetchParts() {
      const query = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        price,
        condition,
        stockStatus,
        category,
        "imageUrl": image.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setParts(data)
        setFilteredParts(data)
      } catch (e) {
        console.error("Marketplace fetch error", e)
      }
    }
    fetchParts()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const results = parts.filter((part) => {
      const matchesSearch = 
        part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || 
        part.category === selectedCategory ||
        part.description?.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    })
    setFilteredParts(results)
  }, [searchTerm, selectedCategory, parts])

  const whatsappNumber = "919600038089"

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif', paddingBottom: isMobile ? '100px' : '0' }}>
      
      <nav style={navStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} />
        </Link>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>
          ← BACK TO HUB
        </Link>
      </nav>

      <header style={{ padding: isMobile ? '40px 20px' : '60px 20px', textAlign: 'center', backgroundColor: '#001a35', color: 'white' }}>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '800', margin: 0 }}>TYRE MARKETPLACE</h1>
        <p style={{ opacity: 0.7, marginTop: '10px', marginBottom: '30px' }}>Certified Sourcing for Training Fleets</p>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text"
            placeholder="Search Part Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchFieldStyle}
          />
        </div>

        <div style={categoryContainerStyle}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={categoryChipStyle(selectedCategory === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredParts.length > 0 ? filteredParts.map((part) => (
            <div key={part._id} style={cardStyle}>
              <div style={badgeStyle(part.stockStatus || 'AVAILABLE')}>{part.stockStatus || 'AVAILABLE'}</div>
              <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                <img 
                  src={part.imageUrl || '/tyre-placeholder.png'} 
                  alt={part.description} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800' }}>PN: {part.partNumber}</span>
                <h3 style={{ fontSize: '1.25rem', color: '#001a35', margin: '8px 0 16px', fontWeight: '700' }}>{part.description}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: '#94a3b8' }}>UNIT PRICE</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#001a35' }}>₹{part.price?.toLocaleString('en-IN') || 'Quote'}</span>
                  </div>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Jedo%20Tech%20RFQ%0A---%0APN:%20${part.partNumber}%0ADesc:%20${part.description}%0AStatus:%20AOG%20Inquiry`}
                    target="_blank"
                    style={buyButtonStyle}
                  >
                    INQUIRE
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px 20px' }}>
              <p style={{ color: '#64748b' }}>No inventory matching your selection.</p>
            </div>
          )}
        </div>
      </main>

      {isMobile && (
        <div style={mobileStickyFooter}>
          <a href={`https://wa.me/${whatsappNumber}?text=Jedo%20Tech%20Aviation%20Sourcing%20Inquiry`} style={mobileWhatappButton}>
            CHAT WITH LOGISTICS DESK
          </a>
        </div>
      )}
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#001a35', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const searchFieldStyle = { width: '100%', padding: '16px 24px', borderRadius: '12px', border: 'none', fontSize: '1rem', color: '#001a35', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const categoryContainerStyle = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px', flexWrap: 'wrap' as const, padding: '0 10px' };
const categoryChipStyle = (active: boolean) => ({ padding: '8px 16px', borderRadius: '20px', border: active ? 'none' : '1px solid rgba(255,255,255,0.3)', backgroundColor: active ? '#ffb400' : 'transparent', color: active ? '#001a35' : 'white', fontSize: '0.8rem', fontWeight: 'bold' as const, cursor: 'pointer' });
const cardStyle = { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' as const, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' as const };
const badgeStyle = (status: string) => ({ position: 'absolute' as const, top: '12px', left: '12px', backgroundColor: status === 'OUT OF STOCK' ? '#ef4444' : '#10b981', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800' as const, zIndex: 2 });
const buyButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '800' as const };
const mobileStickyFooter = { position: 'fixed' as const, bottom: 0, left: 0, width: '100%', padding: '20px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 -10px 25px rgba(0,0,0,0.05)', zIndex: 100 };
const mobileWhatappButton = { display: 'block', backgroundColor: '#25D366', color: 'white', textAlign: 'center' as const, padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1rem' };