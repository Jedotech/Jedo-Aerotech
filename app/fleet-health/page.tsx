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
  const [lastSync, setLastSync] = useState('')
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
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      } catch (e) {
        console.error("Fleet Sync Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchFleet()
  }, [router])

  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  const groupedFleet = assets.reduce((acc, asset) => {
    if (!acc[asset.tailNumber]) {
      acc[asset.tailNumber] = { model: asset.aircraftModel, tyres: [] };
    }
    acc[asset.tailNumber].tyres.push(asset);
    return acc;
  }, {} as Record<string, { model: string, tyres: FleetAsset[] }>);

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
      
      {/* 1. WHO: THE HEADER (CENTERED NAVIGATION & MOBILE READY) */}
      <nav style={navBarStyle}>
        {/* Left Section: Logo */}
        <div style={navLogoSection}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '28px' }} /></Link>
        </div>

        {/* Center Section: Centered Title with Glow */}
        <div style={navTitleSection}>
          <h1 style={responsiveMainTitle}>
            <span style={{ color: '#06b6d4', textShadow: '0 0 12px rgba(6, 182, 212, 0.4)' }}>
              {orgName.toUpperCase()}
            </span> 
            <span style={{ color: '#475569', margin: '0 12px', fontWeight: '300' }}>/</span> 
            <span style={{ color: '#f8fafc', opacity: 0.9 }}>FLEET COMMAND</span>
          </h1>
          <p style={telemetryText}>
            <span style={pulseDot}></span> LIVE TELEMETRY SYNC: {lastSync}
          </p>
        </div>

        {/* Right Section: Compact Actions */}
        <div style={navActionSection}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOGBOOK</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>OUT</button>
        </div>
      </nav>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,180,0,0.15)', width: '100%' }} />

      {/* 2. WHAT'S HAPPENING: EXECUTIVE SUMMARY PANEL */}
      <section style={summaryPanel}>
        <div style={summaryGrid}>
          <div style={summaryCard}>
            <span style={summaryLabel}>FLEET HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
               <h2 style={summaryValue}>{avgFleetHealth}%</h2>
               <div style={progressBase}>
                  <div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: '#10b981', borderRadius: '10px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }} />
               </div>
            </div>
          </div>
          
          <div style={{ ...summaryCard, borderLeft: '4px solid #ef4444' }}>
            <span style={summaryLabel}>CRITICAL (AOG RISK)</span>
            <h2 style={{ ...summaryValue, color: '#ef4444' }}>{criticalTyres}</h2>
            <p style={summarySubLabel}>TYRES BELOW 20% LIFE</p>
          </div>

          <div style={{ ...summaryCard, borderLeft: '4px solid #f59e0b' }}>
            <span style={summaryLabel}>MAINTENANCE PENDING</span>
            <h2 style={{ ...summaryValue, color: '#f59e0b' }}>{warningTyres}</h2>
            <p style={summarySubLabel}>TYRES BELOW 50% LIFE</p>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>OPERATIONAL ASSETS</span>
            <h2 style={summaryValue}>{Object.keys(groupedFleet).length}</h2>
            <p style={summarySubLabel}>TOTAL AIRCRAFT IN HUB</p>
          </div>
        </div>
      </section>

      {/* 3. DETAILS: FLEET GRID */}
      <header style={inventoryHeader}>
        <h3 style={inventoryTitle}>ASSET INVENTORY</h3>
      </header>

      <main style={mainContentStyle}>
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
                        <span style={posLabel}>{tyre.tyrePosition?.toUpperCase().slice(0,4)}</span>
                        <span style={makeLabel}>{tyre.manufacturer}</span>
                      </div>
                      <div style={assetProgressWrapper}>
                        <div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} />
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '45px' }}>
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

// --- STYLES (REFINED & RESPONSIVE) ---
const navBarStyle: any = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', backgroundColor: '#020617' };
const navLogoSection = { flex: '0 0 200px' };
const navTitleSection: any = { flex: '1', textAlign: 'center', minWidth: '300px' };
const navActionSection = { flex: '0 0 250px', display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' };

const responsiveMainTitle = { fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '1.5px' };
const telemetryText = { fontSize: '0.6rem', color: '#10b981', fontWeight: '800', margin: '2px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };
const pulseDot = { width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' };

const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '900', fontSize: '0.65rem', whiteSpace: 'nowrap' as const, letterSpacing: '0.5px' };
const logoutBtn = { background: 'none', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' };

const summaryPanel = { backgroundColor: '#0b0f1a', padding: '40px', borderBottom: '1px solid #1e293b' };
const summaryGrid = { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' };
const summaryLabel = { fontSize: '0.65rem', fontWeight: '900', color: '#64748b', letterSpacing: '1.5px' };
const summaryValue = { fontSize: '2.5rem', margin: '10px 0 0', fontWeight: '900' };
const summarySubLabel = { fontSize: '0.6rem', color: '#94a3b8', margin: 0 };
const progressBase = { flexGrow: 1, height: '8px', backgroundColor: '#0f172a', borderRadius: '10px' };

const inventoryHeader = { padding: '40px 40px 0', maxWidth: '1440px', margin: '0 auto' };
const inventoryTitle = { fontSize: '0.75rem', color: '#64748b', fontWeight: '900', letterSpacing: '3px' };
const mainContentStyle = { padding: '20px 40px 100px', maxWidth: '1440px', margin: '0 auto' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' };

const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '18px', padding: '28px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' };
const tailText = { fontSize: '1.6rem', fontWeight: '900', margin: 0, color: '#ffb400', letterSpacing: '1px' };
const modelText = { margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: '800', letterSpacing: '1px' };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '6px', fontSize: '0.55rem', fontWeight: '900', letterSpacing: '1px' };

const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '18px' };
const tyreRow = { display: 'flex', alignItems: 'center' };
const tyreInfo = { minWidth: '90px' };
const posLabel = { display: 'block', fontSize: '0.55rem', color: '#475569', fontWeight: '900' };
const makeLabel = { fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' };
const assetProgressWrapper = { flexGrow: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '10px', margin: '0 15px' };

const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: 'transparent', color: '#cbd5e1', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', fontSize: '0.7rem', marginTop: '24px', border: '1px solid #1e293b' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '4px' };