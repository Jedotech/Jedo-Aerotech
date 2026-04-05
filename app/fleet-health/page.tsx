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
  tyreModel?: string;
  partNumber?: string;
  tyrePosition?: string;
  currentLandings: number;
  maxDesignLife: number;
  purchasePrice?: number;
  dailyUtilization?: number;
  operatorEmail: string;
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
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const isAuthorized = localStorage.getItem('fleet_access')
    const storedOrg = localStorage.getItem('fleet_user_org')
    
    if (!isAuthorized) {
      router.push('/login')
      return
    }
    setOrgName(storedOrg || 'Authorized Operator')

    async function fetchFleet() {
      try {
        const data = await client.fetch(
          `*[_type == "fleetRecord" && schoolName->organization == $org] | order(tailNumber asc)`,
          { org: storedOrg }
        )
        setAssets(data || [])
      } catch (e) {
        console.error("Fleet Sync Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchFleet()
  }, [router])

  // --- ANALYTICS LOGIC ---
  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  // --- GROUPING & SUMMARY LOGIC ---
  const groupedFleet = assets.reduce((acc, asset) => {
    if (!acc[asset.tailNumber]) {
      acc[asset.tailNumber] = { model: asset.aircraftModel, tyres: [] };
    }
    acc[asset.tailNumber].tyres.push(asset);
    return acc;
  }, {} as Record<string, { model: string, tyres: FleetAsset[] }>);

  // Calculate Critical Metrics for Summary
  const criticalTyres = assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20).length;
  const warningTyres = assets.filter(a => {
    const h = calculateHealth(a.currentLandings, a.maxDesignLife);
    return h >= 20 && h < 50;
  }).length;
  
  const avgFleetHealth = assets.length > 0 
    ? (assets.reduce((sum, a) => sum + calculateHealth(a.currentLandings, a.maxDesignLife), 0) / assets.length).toFixed(0)
    : 0;

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>INITIALIZING FLEET COMMAND...</p></div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: 'white' }}>
      
      {/* NAVIGATION */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '30px' }} /></Link>
          <Link href="/update-logbook" style={navActionBtn}>+ UPDATE LOGBOOK</Link>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={pulseBadge}>LIVE TELEMETRY</div>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      {/* EXECUTIVE SUMMARY PANEL */}
      <section style={summaryPanel}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={summaryCard}>
            <span style={summaryLabel}>FLEET HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
               <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{avgFleetHealth}%</h2>
               <div style={{ flexGrow: 1, height: '8px', backgroundColor: '#1e293b', borderRadius: '10px' }}>
                  <div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: '#10b981', borderRadius: '10px' }} />
               </div>
            </div>
          </div>
          
          <div style={{ ...summaryCard, borderLeft: '4px solid #ef4444' }}>
            <span style={summaryLabel}>CRITICAL (AOG RISK)</span>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0 0', color: '#ef4444' }}>{criticalTyres}</h2>
            <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: 0 }}>TYRES BELOW 20% LIFE</p>
          </div>

          <div style={{ ...summaryCard, borderLeft: '4px solid #f59e0b' }}>
            <span style={summaryLabel}>MAINTENANCE PENDING</span>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0 0', color: '#f59e0b' }}>{warningTyres}</h2>
            <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: 0 }}>TYRES BELOW 50% LIFE</p>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>OPERATIONAL ASSETS</span>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0 0' }}>{Object.keys(groupedFleet).length}</h2>
            <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: 0 }}>TOTAL AIRCRAFT IN HUB</p>
          </div>
        </div>
      </section>

      {/* HEADER */}
      <header style={{ padding: '40px 40px 20px', maxWidth: '1440px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900' }}>{orgName.toUpperCase()} <span style={{ color: '#94a3b8' }}>| ASSET INVENTORY</span></h1>
      </header>

      {/* FLEET GRID */}
      <main style={{ padding: '0 40px 100px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={fleetGrid}>
          {Object.entries(groupedFleet).map(([tail, data]) => (
            <div key={tail} style={aircraftCard}>
              <div style={aircraftHeader}>
                <div>
                  <h2 style={tailText}>{tail}</h2>
                  <p style={modelText}>{data.model.toUpperCase()}</p>
                </div>
                <div style={activeBadge}>MONITORING</div>
              </div>

              <div style={tyreContainer}>
                {data.tyres.map((tyre) => {
                  const health = calculateHealth(tyre.currentLandings, tyre.maxDesignLife);
                  const color = health < 20 ? '#ef4444' : health < 50 ? '#f59e0b' : '#10b981';
                  
                  return (
                    <div key={tyre._id} style={tyreRow}>
                      <div style={tyreInfo}>
                        <span style={posLabel}>{tyre.tyrePosition?.toUpperCase()}</span>
                        <span style={makeLabel}>{tyre.manufacturer}</span>
                      </div>
                      <div style={{ flexGrow: 1, margin: '0 15px' }}>
                        <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '10px' }}>
                           <div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '60px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color }}>{health.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href={`https://wa.me/919600038089?text=Quote%20Request%20for%20${tail}`} target="_blank" style={orderBtn}>
                ORDER SPARES FOR {tail}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// --- STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#020617' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '800', fontSize: '0.7rem' };
const pulseBadge = { color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '900' };
const logoutBtn = { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem' };
const summaryPanel = { backgroundColor: '#0f172a', padding: '40px', borderBottom: '1px solid #1e293b' };
const summaryCard = { backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px' };
const summaryLabel = { fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' };
const aircraftCard = { backgroundColor: '#0f172a', borderRadius: '16px', padding: '25px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tailText = { fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#ffb400' };
const modelText = { margin: 0, fontSize: '0.6rem', color: '#94a3b8', fontWeight: '800' };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '4px', fontSize: '0.5rem', fontWeight: '900' };
const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const tyreRow = { display: 'flex', alignItems: 'center' };
const tyreInfo = { minWidth: '100px' };
const posLabel = { display: 'block', fontSize: '0.5rem', color: '#64748b', fontWeight: '900' };
const makeLabel = { fontSize: '0.75rem', fontWeight: '700' };
const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: '#020617', color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.65rem', marginTop: '20px', border: '1px solid #1e293b' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900' };