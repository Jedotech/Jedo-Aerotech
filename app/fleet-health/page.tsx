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
      
      {/* 1. WHO: RESPONSIVE HEADER */}
      <nav style={navBarStyle}>
        <div style={navLogoSection}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '28px' }} /></Link>
        </div>

        <div style={navTitleSection}>
          <h1 style={responsiveMainTitle}>
            <span style={{ color: '#06b6d4', textShadow: '0 0 12px rgba(6, 182, 212, 0.4)' }}>{orgName.toUpperCase()}</span> 
            <span style={{ color: '#475569', margin: '0 10px' }}>/</span> 
            <span style={{ color: '#f8fafc' }}>FLEET COMMAND</span>
          </h1>
          <p style={telemetryText}>
            <span style={pulseDot}></span> LIVE TELEMETRY: {lastSync}
          </p>
        </div>

        <div style={navActionSection}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOG</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>OUT</button>
        </div>
      </nav>

      {/* 2. WHAT: RESPONSIVE SUMMARY PANEL */}
      <section style={summaryPanel}>
        <div style={summaryGrid}>
          <div style={summaryCard}>
            <span style={summaryLabel}>HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
               <h2 style={summaryValue}>{avgFleetHealth}%</h2>
               <div style={progressBase}>
                  <div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: '#10b981', borderRadius: '10px' }} />
               </div>
            </div>
          </div>
          
          <div style={{ ...summaryCard, borderLeft: '4px solid #ef4444' }}>
            <span style={summaryLabel}>CRITICAL (AOG)</span>
            <h2 style={{ ...summaryValue, color: '#ef4444' }}>{criticalTyres}</h2>
          </div>

          <div style={{ ...summaryCard, borderLeft: '4px solid #f59e0b' }}>
            <span style={summaryLabel}>PENDING</span>
            <h2 style={{ ...summaryValue, color: '#f59e0b' }}>{warningTyres}</h2>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>ASSETS</span>
            <h2 style={summaryValue}>{Object.keys(groupedFleet).length}</h2>
          </div>
        </div>
      </section>

      {/* 3. DETAILS: FLEET GRID */}
      <main style={mainContentStyle}>
        <h3 style={inventoryTitle}>ASSET INVENTORY</h3>
        <div style={fleetGrid}>
          {Object.entries(groupedFleet).map(([tail, data]) => (
            <div key={tail} style={aircraftCard}>
              <div style={aircraftHeader}>
                <div>
                  <h2 style={tailText}>{tail}</h2>
                  <p style={modelText}>{data.model.toUpperCase()}</p>
                </div>
                <div style={activeBadge}>LIVE</div>
              </div>

              <div style={tyreContainer}>
                {data.tyres.map((tyre) => {
                  const health = calculateHealth(tyre.currentLandings, tyre.maxDesignLife);
                  const color = health < 20 ? '#ef4444' : health < 50 ? '#f59e0b' : '#10b981';
                  
                  return (
                    <div key={tyre._id} style={tyreRow}>
                      <div style={tyreInfo}>
                        <span style={posLabel}>{tyre.tyrePosition?.slice(0,4).toUpperCase()}</span>
                        <span style={makeLabel}>{tyre.manufacturer}</span>
                      </div>
                      <div style={assetProgressBase}>
                        <div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} />
                      </div>
                      <div style={healthPercentText(color)}>{health.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
              <Link href={`https://wa.me/919600038089?text=Jedo%20Order:%20${tail}`} target="_blank" style={orderBtn}>
                PROCURE FOR {tail}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// --- STYLES (MOBILE ENHANCED) ---
const navBarStyle: any = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b' };
const navLogoSection = { flex: '0 0 auto' };
const navTitleSection: any = { flex: '1 1 100%', order: 3, textAlign: 'center', marginTop: '10px', '@media (min-width: 768px)': { flex: '1', order: 2, marginTop: 0 } };
const navActionSection = { flex: '0 0 auto', display: 'flex', gap: '8px', order: 2 };

const responsiveMainTitle: any = { fontSize: '1rem', fontWeight: '900', margin: 0, letterSpacing: '1px' };
const telemetryText = { fontSize: '0.55rem', color: '#10b981', fontWeight: '800', margin: 0, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' };
const pulseDot = { width: '5px', height: '5px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 5px #10b981' };

const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '900', fontSize: '0.65rem' };
const logoutBtn = { background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '5px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '700' };

const summaryPanel = { backgroundColor: '#0b0f1a', padding: '20px', borderBottom: '1px solid #1e293b' };
const summaryGrid = { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' };
const summaryLabel = { fontSize: '0.55rem', fontWeight: '900', color: '#64748b', letterSpacing: '1px' };
const summaryValue = { fontSize: '1.5rem', margin: '4px 0 0', fontWeight: '900' };
const progressBase = { flexGrow: 1, height: '6px', backgroundColor: '#0f172a', borderRadius: '10px' };

const mainContentStyle = { padding: '20px', maxWidth: '1440px', margin: '0 auto' };
const inventoryTitle = { fontSize: '0.7rem', color: '#64748b', fontWeight: '900', letterSpacing: '2px', marginBottom: '15px' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };

const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const tailText = { fontSize: '1.3rem', fontWeight: '900', margin: 0, color: '#ffb400' };
const modelText = { margin: 0, fontSize: '0.6rem', color: '#64748b', fontWeight: '800' };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', fontSize: '0.5rem', fontWeight: '900' };

const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '12px' };
const tyreRow = { display: 'flex', alignItems: 'center' };
const tyreInfo = { minWidth: '80px' };
const posLabel = { display: 'block', fontSize: '0.5rem', color: '#475569', fontWeight: '900' };
const makeLabel = { fontSize: '0.7rem', fontWeight: '700', color: '#cbd5e1' };
const assetProgressBase = { flexGrow: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '10px', margin: '0 10px' };
const healthPercentText = (color: string) => ({ fontSize: '0.7rem', fontWeight: '900' as const, color, minWidth: '35px', textAlign: 'right' as const });

const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: 'transparent', color: '#cbd5e1', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.65rem', marginTop: '15px', border: '1px solid #1e293b' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', fontSize: '1rem' };