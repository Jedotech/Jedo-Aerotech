'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE
interface FleetAsset {
  _id: string;
  tailNumber: string;
  aircraftModel: string;
  manufacturer?: string; 
  tyrePosition?: string;
  currentLandings: number;
  maxDesignLife: number;
  purchasePrice?: number; // USD from Sanity
  serialNumber?: string;
  retreadStatus?: string;
  status?: string;
  partNumber?: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function FleetHealth() {
  const [assets, setAssets] = useState<FleetAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [lastSync, setLastSync] = useState('')
  const [exchangeRate, setExchangeRate] = useState(83.50) // Fallback rate
  const router = useRouter()

  const API_KEY = 'cf89f7b96ff3c0675edcfe39'

  useEffect(() => {
    setMounted(true)
    const isAuthorized = localStorage.getItem('fleet_access')
    const storedOrg = localStorage.getItem('fleet_user_org')
    
    if (!isAuthorized) {
      router.push('/login')
      return
    }
    setOrgName(storedOrg || 'Authorized Operator')

    // FETCH LIVE EXCHANGE RATE & FLEET DATA
    async function initializeDashboard() {
      try {
        // 1. Fetch Currency Data
        const rateRes = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/INR`)
        const rateData = await rateRes.json()
        if (rateData.conversion_rate) {
          setExchangeRate(rateData.conversion_rate)
        }

        // 2. Fetch Fleet Data
        const data = await client.fetch(
          `*[_type == "fleetRecord" && schoolName->organization == $org && status == "active"] | order(tailNumber asc)`,
          { org: storedOrg }
        )
        setAssets(data || [])
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      } catch (e) {
        console.error("Dashboard Init Error:", e)
      } finally {
        setLoading(false)
      }
    }
    
    initializeDashboard()
  }, [router])

  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  const getHealthColor = (health: number) => {
    if (health < 20) return '#ef4444'; 
    if (health < 50) return '#f59e0b'; 
    return '#10b981'; 
  }

  const groupedFleet = assets.reduce((acc, asset) => {
    if (!acc[asset.tailNumber]) {
      acc[asset.tailNumber] = { model: asset.aircraftModel, tyres: [] };
    }
    acc[asset.tailNumber].tyres.push(asset);
    return acc;
  }, {} as Record<string, { model: string, tyres: FleetAsset[] }>);

  const avgFleetHealth = assets.length > 0 
    ? (assets.reduce((sum, a) => sum + calculateHealth(a.currentLandings, a.maxDesignLife), 0) / assets.length).toFixed(0)
    : 0;

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>SYNCING LIVE TELEMETRY...</p></div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: 'white' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .nav-bar { padding: 10px 15px !important; flex-direction: column !important; gap: 10px !important; }
          .summary-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .fleet-grid { grid-template-columns: 1fr !important; padding: 10px !important; }
          .tech-row { padding: 12px !important; flex-direction: column !important; align-items: flex-start !important; }
          .data-stack { width: 100% !important; margin-top: 10px !important; display: flex !important; justify-content: space-between !important; }
        }
      `}} />

      <nav className="nav-bar" style={navBarStyle}>
        <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '24px' }} /></Link>
        <div style={{ textAlign: 'center' }}>
          <h1 style={responsiveMainTitle}><span style={{ color: '#06b6d4' }}>{orgName.toUpperCase()}</span> / FLEET COMMAND</h1>
          <p style={telemetryText}><span style={pulseDot}></span> LIVE RATE: 1 USD = ₹{exchangeRate.toFixed(2)}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOGBOOK</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <section style={summaryPanel}>
        <div className="summary-grid" style={summaryGrid}>
          <div style={{ ...summaryCard, gridColumn: 'span 2' }}>
            <span style={summaryLabel}>FLEET HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' }}>
                <h2 style={summaryValue}>{avgFleetHealth}%</h2>
                <div style={progressBase}><div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: '#10b981', borderRadius: '10px' }} /></div>
            </div>
          </div>
          <div style={{ ...summaryCard, borderLeft: '3px solid #ef4444' }}>
            <span style={summaryLabel}>AOG RISK</span>
            <h2 style={{ ...summaryValue, color: '#ef4444' }}>{assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20).length}</h2>
          </div>
          <div style={{ ...summaryCard, borderLeft: '3px solid #f59e0b' }}>
            <span style={summaryLabel}>WATCHLIST</span>
            <h2 style={{ ...summaryValue, color: '#f59e0b' }}>{assets.filter(a => { const h = calculateHealth(a.currentLandings, a.maxDesignLife); return h >= 20 && h < 50; }).length}</h2>
          </div>
        </div>
      </section>

      <main style={{ padding: '20px', maxWidth: '1440px', margin: '0 auto' }}>
        <div className="fleet-grid" style={fleetGrid}>
          {Object.entries(groupedFleet).map(([tail, data]) => (
            <div key={tail} style={aircraftCard}>
              <div style={aircraftHeader}>
                <h2 style={tailText}>{tail}</h2>
                <div style={activeBadge}>MONITORING</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.tyres.map((tyre) => {
                  const health = calculateHealth(tyre.currentLandings, tyre.maxDesignLife);
                  const color = getHealthColor(health);
                  
                  // LIVE CPL CALCULATION: (USD * LIVE RATE) / LANDINGS
                  const purchasePriceINR = (tyre.purchasePrice || 0) * exchangeRate;
                  const cplINR = (purchasePriceINR > 0 && tyre.currentLandings > 0) 
                    ? (purchasePriceINR / tyre.currentLandings).toFixed(2) 
                    : '0.00';

                  return (
                    <div key={tyre._id} className="tech-row" style={{ ...technicalRow, borderLeft: `3px solid ${color}` }}>
                      <div style={{ flexGrow: 1, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={makeLabel}>{tyre.tyrePosition}: {tyre.manufacturer}</span>
                          <span style={pnLabel}>S/N: {tyre.serialNumber || 'TBD'}</span>
                        </div>
                        <div style={assetProgressWrapper}><div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} /></div>
                        
                        <div className="data-stack" style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.55rem', color: color, fontWeight: 'bold' }}>{tyre.maxDesignLife - tyre.currentLandings} LNDG REMAINING</span>
                          <div style={cplBadgeStyle}>CPL: ₹{cplINR}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link href={`https://wa.me/919600038089?text=Order%20for%20${tail}`} target="_blank" style={orderBtn}>ORDER SPARES FOR {tail}</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Styles - (Preserved)
const cplBadgeStyle = { backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.3)', fontSize: '0.55rem', color: '#06b6d4', fontWeight: 'bold' };
const navBarStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#020617' };
const responsiveMainTitle = { fontSize: '1rem', fontWeight: '900', margin: 0 };
const telemetryText = { fontSize: '0.55rem', color: '#10b981', fontWeight: '700', margin: '2px 0 0' };
const pulseDot = { width: '5px', height: '5px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '800', fontSize: '0.65rem' };
const logoutBtn = { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', fontSize: '0.65rem' };
const summaryPanel = { backgroundColor: '#0b0f1a', padding: '25px 40px' };
const summaryGrid = { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '15px', borderRadius: '10px' };
const summaryLabel = { fontSize: '0.55rem', fontWeight: '800', color: '#64748b' };
const summaryValue = { fontSize: '1.6rem', margin: '5px 0 0', fontWeight: '900' };
const progressBase = { flexGrow: 1, height: '6px', backgroundColor: '#0f172a', borderRadius: '10px' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' };
const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '15px', padding: '20px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };
const tailText = { fontSize: '1.4rem', fontWeight: '900', color: '#ffb400', margin: 0 };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.5rem', fontWeight: '900' };
const technicalRow = { display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#161d2f', borderRadius: '8px' };
const makeLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1' };
const pnLabel = { fontSize: '0.55rem', color: '#64748b' };
const assetProgressWrapper = { height: '4px', backgroundColor: '#1e293b', borderRadius: '10px', marginTop: '4px' };
const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: 'transparent', color: '#ffb400', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', fontSize: '0.7rem', marginTop: '15px', border: '1px solid #ffb400' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400' };