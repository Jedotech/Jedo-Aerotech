'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from 'next-sanity'

interface InventoryPart {
  _id: string;
  partNumber: string;
  description: string;
  priceUSD: number;
  qtyAvailable: number; 
  condition?: string;
  location?: string;
  certUrl?: string;
  // Fleet Intelligence Fields
  manufacturer?: string;
  totalLandings?: number;
  maxDesignLife?: number;
  dailyUtilization?: number;
}

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryPart[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // CURRENCY LOGIC
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR')
  const [exchangeRate, setExchangeRate] = useState<number>(83.50)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // QR CODE SEARCH DETECTION
    const params = new URLSearchParams(window.location.search);
    const querySearch = params.get('search');
    if (querySearch) {
      setSearchTerm(decodeURIComponent(querySearch));
    }

    async function fetchData() {
      const query = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        "priceUSD": priceUSD,
        "qtyAvailable": quantity,
        condition,
        "location": warehouse,
        manufacturer,
        totalLandings,
        maxDesignLife,
        dailyUtilization,
        "certUrl": certificate.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setItems(data || [])
        setFilteredItems(data || [])
        
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const rateData = await rateRes.json()
        if (rateData?.rates?.INR) setExchangeRate(rateData.rates.INR)
      } catch (e) { 
        console.error("Fetch error:", e) 
      }
    }
    fetchData()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const results = items.filter((item) =>
      item.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(results)
  }, [searchTerm, items])

  // INTELLIGENCE CALCULATIONS
  const calculateIntel = (item: InventoryPart) => {
    const landingsRemaining = (item.maxDesignLife || 0) - (item.totalLandings || 0);
    const daysLeft = item.dailyUtilization && item.dailyUtilization > 0 
      ? Math.max(0, Math.floor(landingsRemaining / item.dailyUtilization)) 
      : null;
    
    // Cost Per Landing (CPL) is Price / Max Design Cycles
    const cpl = item.maxDesignLife && item.maxDesignLife > 0
      ? (item.priceUSD / item.maxDesignLife).toFixed(2)
      : '0.00';

    const wearProgress = item.maxDesignLife 
      ? Math.min(Math.round(((item.totalLandings || 0) / item.maxDesignLife) * 100), 100) 
      : 0;

    return { daysLeft, cpl, wearProgress };
  }

  const formatPrice = (usdAmount: number = 0) => {
    if (currency === 'INR') {
      return `₹${(usdAmount * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    }
    return `$${usdAmount.toLocaleString('en-US')}`
  }

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. NAVIGATION */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '25px' }} /></Link>
          <span style={dividerStyle}>|</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '0.05em' }}>FLEET INTELLIGENCE TERMINAL</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={currencySwitcherPill}>
            <button onClick={() => setCurrency('USD')} style={currency === 'USD' ? activePillBtn : inactivePillBtn}>USD</button>
            <button onClick={() => setCurrency('INR')} style={currency === 'INR' ? activePillBtn : inactivePillBtn}>INR</button>
          </div>
          {selectedItems.length > 0 && (
            <button onClick={() => router.push(`/inventory/manifest?ids=${selectedItems.join(',')}`)} style={batchActionBtn}>
              {selectedItems.length} SELECTED: GENERATE PACKING LIST
            </button>
          )}
          <Link href="https://jedo-fleet-intel.vercel.app/studio" target="_blank" style={adminButtonStyle}>+ NEW ENTRY</Link>
        </div>
      </nav>

      {/* 2. HEADER */}
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#001a35', margin: 0 }}>Active Tyre Fleet</h1>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px' }}>Real-time Wear Analytics | $1 = {exchangeRate.toFixed(2)} INR</p>
        </div>
        <input 
          type="text" 
          placeholder="Filter P/N, Brand or Model..." 
          style={searchFieldStyle} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </header>

      {/* 3. MAIN TABLE */}
      <main style={{ padding: isMobile ? '0 10px' : '0 40px' }}>
        <div style={tableContainer}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thStyle}>SELECT</th>
                  <th style={thStyle}>PART / MANUFACTURER</th>
                  <th style={thStyle}>WEAR STATUS</th>
                  <th style={thStyle}>EST. REPLACEMENT</th>
                  <th style={thStyle}>CPL (USD)</th>
                  <th style={thStyle}>STOCK</th>
                  <th style={thStyle}>UNIT PRICE</th>
                  <th style={thStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const { daysLeft, cpl, wearProgress } = calculateIntel(item);
                  
                  return (
                    <tr key={item._id} style={trStyle}>
                      <td style={tdStyle}>
                        <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => toggleSelect(item._id)} />
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 'bold', color: '#001a35' }}>{item.partNumber}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{item.manufacturer || 'OEM'}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ width: '100px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginBottom: '4px' }}>
                          <div style={{ width: `${wearProgress}%`, height: '100%', backgroundColor: wearProgress > 85 ? '#ef4444' : '#10b981', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>{wearProgress}% ({item.totalLandings}/{item.maxDesignLife || '∞'})</span>
                      </td>
                      <td style={tdStyle}>
                        {daysLeft !== null ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: daysLeft < 10 ? '#ef4444' : '#334155', fontWeight: 'bold' }}>
                              {daysLeft} Days Left
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>at {item.dailyUtilization} ldg/day</span>
                          </div>
                        ) : <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>No util. data</span>}
                      </td>
                      <td style={tdStyle}>
                        <span style={{fontWeight: '700', color: '#0f172a'}}>${cpl}</span>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>PER LANDING</div>
                      </td>
                      <td style={tdStyle}>
                        <span style={item.qtyAvailable <= 2 ? lowStockAlert : healthyStock}>
                          {item.qtyAvailable || 0} Units
                        </span>
                      </td>
                      <td style={{...tdStyle, fontWeight: '700'}}>{formatPrice(item.priceUSD)}</td>
                      <td style={tdStyle}>
                        <Link href={`https://jedo-fleet-intel.vercel.app/studio/intent/edit/id=${item._id}`} target="_blank" style={editLink}>LOG DATA</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer style={footerStyle}>
        © 2026 Jedo Technologies Pvt. Ltd. | Aviation Supply Chain Intelligence | Chennai, India
      </footer>
    </div>
  )
}

// --- STYLES (Preserving your exact UI) ---
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', backgroundColor: '#001a35' };
const dividerStyle = { color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', fontWeight: '300' };
const adminButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '6px 14px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.75rem' };
const batchActionBtn = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem', cursor: 'pointer' };
const currencySwitcherPill = { display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px' };
const activePillBtn = { backgroundColor: '#ffb400', color: '#001a35', border: 'none', padding: '4px 12px', borderRadius: '2px', fontWeight: 'bold', fontSize: '0.65rem', cursor: 'pointer' };
const inactivePillBtn = { backgroundColor: 'transparent', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '2px', fontSize: '0.65rem', cursor: 'pointer' };
const headerStyle = { padding: '24px 40px', display: 'flex', alignItems: 'center', gap: '40px' };
const searchFieldStyle = { width: '320px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const tableContainer = { backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '40px' };
const thRowStyle = { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle = { padding: '14px 20px', textAlign: 'left' as const, fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.025em' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '16px 20px', fontSize: '0.85rem', color: '#334155' };
const lowStockAlert = { backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' as const, fontSize: '0.75rem' };
const healthyStock = { color: '#64748b', fontWeight: '600' as const };
const editLink = { color: '#64748b', textDecoration: 'none', fontSize: '0.7rem', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' as const, transition: 'all 0.2s' };
const footerStyle = { textAlign: 'center' as const, padding: '30px', fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0' };