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
  qtyAvailable: number; 
  condition?: string;
  location?: string;
  certUrl?: string; 
}

// UPDATED: Dataset changed to 'production'
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
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return;

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
        qtyAvailable,
        condition,
        location,
        "certUrl": certificate.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setItems(data || [])
        setFilteredItems(data || [])
      } catch (e) { 
        console.error("Inventory fetch error:", e) 
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

  // BATCH SELECTION LOGIC
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. COMPACT NAVIGATION */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo" style={{ height: '25px' }} />
          </Link>
          <span style={dividerStyle}>|</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>LOGISTICS TERMINAL</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            {selectedItems.length > 0 && (
                <button style={batchActionBtn}>{selectedItems.length} SELECTED: GENERATE PACKING LIST</button>
            )}
            <Link href="https://jedo-fleet-intel.vercel.app/studio" target="_blank" style={adminButtonStyle}>
              + NEW ENTRY
            </Link>
        </div>
      </nav>

      {/* 2. TABLE CONTROL HEADER */}
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#001a35', margin: 0 }}>Warehouse Inventory</h1>
            <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{items.length} Units Active in Database</p>
        </div>
        <input 
          type="text" 
          placeholder="Filter P/N, Description or Serial..." 
          style={searchFieldStyle} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* 3. DATA TABLE */}
      <main style={{ padding: isMobile ? '0 10px' : '0 40px' }}>
        <div style={tableContainer}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thStyle}>SELECT</th>
                  <th style={thStyle}>PART NUMBER</th>
                  <th style={thStyle}>DESCRIPTION</th>
                  <th style={thStyle}>CONDITION</th>
                  <th style={thStyle}>LOCATION</th>
                  <th style={thStyle}>QTY</th>
                  <th style={thStyle}>UNIT PRICE</th>
                  <th style={thStyle}>DOCS</th>
                  <th style={thStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? filteredItems.map((item) => (
                  <tr key={item._id} style={trStyle}>
                    <td style={tdStyle}>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item._id)} 
                        onChange={() => toggleSelect(item._id)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{...tdStyle, fontWeight: 'bold', color: '#001a35'}}>{item.partNumber}</td>
                    <td style={tdStyle}>{item.description}</td>
                    <td style={tdStyle}><span style={badgeStyle}>{item.condition || 'N/A'}</span></td>
                    <td style={tdStyle}>{item.location || 'CHENNAI'}</td>
                    
                    {/* LOW STOCK ALERT LOGIC */}
                    <td style={tdStyle}>
                      <span style={item.qtyAvailable <= 2 ? lowStockAlert : healthyStock}>
                          {item.qtyAvailable || 0} Units
                      </span>
                    </td>
                    
                    <td style={tdStyle}>₹{item.price?.toLocaleString('en-IN') || '0'}</td>
                    
                    <td style={tdStyle}>
                      {item.certUrl ? (
                          <a href={item.certUrl} target="_blank" rel="noopener noreferrer" style={certLink}>VIEW CERT</a>
                      ) : <span style={{opacity: 0.3}}>NO DOC</span>}
                    </td>
                    
                    {/* FIXED ACTION LINK: Using Intent for Sanity 404 Fix */}
                    <td style={tdStyle}>
                      <Link 
                        href={`https://jedo-fleet-intel.vercel.app/studio/intent/edit/id=${item._id}`} 
                        target="_blank" 
                        style={editLink}
                      >
                        EDIT
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <footer style={footerStyle}>
        © 2026 Jedo Technologies Pvt. Ltd. | DGCA, FAA & EASA Compliance
      </footer>
    </div>
  )
}

// --- STYLES ---
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: '#001a35' };
const dividerStyle = { color: 'rgba(255,255,255,0.2)' };
const adminButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.75rem' };
const batchActionBtn = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem', cursor: 'pointer', marginRight: '10px' };

const headerStyle = { padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' as const };
const searchFieldStyle = { width: '300px', padding: '8px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' };

const tableContainer = { backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '40px' };
const thRowStyle = { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle = { padding: '12px 20px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' as const };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '12px 20px', fontSize: '0.85rem', color: '#334155' };

const lowStockAlert = { backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem' };
const healthyStock = { color: '#64748b', fontWeight: '600' as const };
const badgeStyle = { fontSize: '0.7rem', fontWeight: 'bold' as const, color: '#001a35', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' };
const certLink = { color: '#2563eb', fontWeight: 'bold' as const, textDecoration: 'none', fontSize: '0.75rem' };
const editLink = { color: '#64748b', textDecoration: 'none', fontSize: '0.75rem', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px' };
const footerStyle = { textAlign: 'center' as const, padding: '20px', fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0' };