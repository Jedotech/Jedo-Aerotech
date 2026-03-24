'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. TYPE-SAFE INTERFACE
interface InventoryPart {
  _id: string;
  partNumber: string;
  description: string;
  price?: number;
  stockStatus?: string;
  condition?: string;
  location?: string; // e.g., 'Chennai Hangar 1'
  imageUrl?: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryPart[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function fetchInventory() {
      const query = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        price,
        stockStatus,
        condition,
        location,
        "imageUrl": image.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setItems(data)
        setFilteredItems(data)
      } catch (e) {
        console.error("Inventory fetch error", e)
      }
    }
    fetchInventory()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // SEARCH LOGIC
  useEffect(() => {
    const results = items.filter((item) =>
      item.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(results)
  }, [searchTerm, items])

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. TOP NAVIGATION */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo" style={{ height: '30px' }} />
          </Link>
          <span style={dividerStyle}>|</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>INVENTORY CONTROL</span>
        </div>
        <Link href="https://jedo-fleet-intel.vercel.app/studio" target="_blank" style={adminButtonStyle}>
          + ADD STOCK
        </Link>
      </nav>

      {/* 2. SEARCH & SUMMARY HEADER */}
      <header style={{ padding: isMobile ? '20px' : '40px 60px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#001a35', margin: 0 }}>Global Parts Repository</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0 0' }}>{items.length} Total Units | {items.filter(i => i.stockStatus !== 'OUT OF STOCK').length} Available</p>
          </div>
          <div style={{ width: isMobile ? '100%' : '400px' }}>
            <input 
              type="text" 
              placeholder="Filter by PN or Description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchFieldStyle}
            />
          </div>
        </div>
      </header>

      {/* 3. INVENTORY LIST */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px 60px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div key={item._id} style={itemCardStyle}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={imageThumbStyle}>
                  <img 
                    src={item.imageUrl || '/tyre-placeholder.png'} 
                    alt="part" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={pnLabelStyle}>{item.partNumber}</span>
                    <span style={statusBadgeStyle(item.stockStatus || 'AVAILABLE')}>
                      {item.stockStatus || 'AVAILABLE'}
                    </span>
                  </div>
                  <h3 style={descStyle}>{item.description}</h3>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <span style={metaLabelStyle}>COND: <b style={{color: '#001a35'}}>{item.condition || 'NEW'}</b></span>
                    <span style={metaLabelStyle}>LOC: <b style={{color: '#001a35'}}>{item.location || 'CHENNAI'}</b></span>
                  </div>
                </div>
              </div>
              <div style={cardFooterStyle}>
                <span style={{ fontWeight: '800', color: '#001a35' }}>₹{item.price?.toLocaleString('en-IN') || '---'}</span>
                <Link 
                  href={`https://jedo-fleet-intel.vercel.app/studio/structure/part;${item._id}`}
                  target="_blank"
                  style={editButtonStyle}
                >
                  EDIT RECORD
                </Link>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0' }}>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No stock items found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#001a35' };
const dividerStyle = { color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' };
const adminButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.8rem' };

const searchFieldStyle = { width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' as const };

const itemCardStyle = { backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const imageThumbStyle = { width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', flexShrink: 0 };
const pnLabelStyle = { fontSize: '0.7rem', fontWeight: '900', color: '#ffb400', letterSpacing: '0.5px' };
const descStyle = { fontSize: '1rem', fontWeight: '700', color: '#001a35', margin: '4px 0 0', lineHeight: '1.3' };
const metaLabelStyle = { fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' as const };

const statusBadgeStyle = (status: string) => ({
  fontSize: '0.6rem',
  fontWeight: '800' as const,
  padding: '3px 8px',
  borderRadius: '4px',
  backgroundColor: status === 'OUT OF STOCK' ? '#fee2e2' : '#dcfce7',
  color: status === 'OUT OF STOCK' ? '#ef4444' : '#10b981'
});

const cardFooterStyle = { borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const editButtonStyle = { fontSize: '0.75rem', fontWeight: 'bold' as const, color: '#64748b', textDecoration: 'none', padding: '5px 10px', border: '1px solid #e2e8f0', borderRadius: '4px' };