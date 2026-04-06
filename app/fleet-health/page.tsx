'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. UPDATED DATA INTERFACE
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
  // --- NEW FIELDS ---
  serialNumber?: string;
  retreadStatus?: string;
  vendorName?: string;
  status?: string;
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
          `*[_type == "fleetRecord" && schoolName->organization == $org && status == "active"] | order(tailNumber asc) {
            ...,
            "vendorName": vendorName,
            "serialNumber": serialNumber,
            "retreadStatus": retreadStatus
          }`,
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

  const generateWaMessage = (tail: string, tyres: FleetAsset[]) => {
    const posCodeMap: Record<string, string> = {
      'Nose Gear': 'N',
      'Main Left': 'ML',
      'Main Right': 'MR'
    };

    const sortedTyres = [...tyres].sort((a, b) => 
      (a.maxDesignLife - a.currentLandings) - (b.maxDesignLife - b.currentLandings)
    );

    let msg = `*COMPLIANCE & SPARES ORDER*\n*AIRCRAFT:* ${tail}\n\n`;

    sortedTyres.forEach(t => {
      const remaining = Math.max(0, t.maxDesignLife - t.currentLandings);
      const health = calculateHealth(t.currentLandings, t.maxDesignLife);
      const pos = posCodeMap[t.tyrePosition || ''] || '??';
      
      const statusLabel = health < 20 ? `🚨 *AOG RISK*` : `✅ *MONITORING*`;
      
      msg += `${statusLabel}\n`;
      msg += `Pos: [${pos}] | S/N: ${t.serialNumber || 'TBD'}\n`; 
      msg += `Cond: ${t.retreadStatus || 'New'}\n`;
      msg += `Rem: ${remaining} Landings\n\n`;
    });

    return encodeURIComponent(msg);
  };

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>INITIALIZING FLEET COMMAND...</p></div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: 'white' }}>
      
      <nav style={navBarStyle}>
        <div style={navLogoSection}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '28px' }} /></Link>
        </div>

        <div style={navTitleSection}>
          <h1 style={responsiveMainTitle}>
            <span style={{ color: '#06b6d4', textShadow: '0 0 12px rgba(6, 182, 212, 0.4)' }}>
              {orgName.toUpperCase()}
            </span> 
            <span style={{ color: '#475569', margin: '0 15px', fontWeight: '300' }}>/</span> 
            <span style={{ color: '#f8fafc', opacity: 0.9 }}>FLEET COMMAND</span>
          </h1>
          <p style={telemetryText}>
            <span style={pulseDot}></span> LIVE TELEMETRY SYNC: {lastSync}
          </p>
        </div>

        <div style={navActionSection}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOGBOOK</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,180,0,0.15)', width: '100%' }} />

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
                  const remaining = Math.max(0, tyre.maxDesignLife - tyre.currentLandings);
                  
                  const posCodeMap: Record<string, string> = {
                    'Nose Gear': 'N',
                    'Main Left': 'ML',
                    'Main Right': 'MR'
                  };
                  const posCode = posCodeMap[tyre.tyrePosition || ''] || '??';

                  return (
                    <div key={tyre._id} style={technicalRow}>
                      <div style={posCodeBox}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#ffb400' }}>{posCode}</span>
                      </div>
                      
                      <div style={{ flexGrow: 1, minWidth: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
                            <span style={makeLabel}>{tyre.manufacturer} ({tyre.retreadStatus || 'New'})</span>
                            <span style={pnLabel}>S/N: {tyre.serialNumber || 'TBD'}</span>
                        </div>
                        <div style={assetProgressWrapper}>
                          <div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} />
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.5rem', color: '#64748b' }}>P/N: {tyre.partNumber || 'TBD'}</p>
                      </div>

                      <div style={techDataColumn}>
                        <span style={columnHeader}>ACCUMULATED</span>
                        <span style={{ ...columnValue, color }}>{tyre.currentLandings} / {tyre.maxDesignLife}</span>
                      </div>

                      <div style={techDataColumn}>
                        <span style={columnHeader}>REMAINING</span>
                        <span style={{ ...columnValue, color }}>{remaining} LNDG</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SMARTER MICRO-DATA BADGE */}
              <div style={{ 
                marginTop: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                opacity: 0.6 
              }}>
                <div style={{ 
                  width: '4px', 
                  height: '4px', 
                  backgroundColor: '#06b6d4', 
                  borderRadius: '50%', 
                  boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' 
                }}></div>
                <span style={{ 
                  fontSize: '0.55rem', 
                  fontWeight: '500', 
                  color: '#94a3b8', 
                  letterSpacing: '1.5px', 
                  fontFamily: 'monospace',
                  textTransform: 'uppercase'
                }}>
                   JEDO TECH <span style={{ color: '#334155', margin: '0 4px' }}>|</span> VERIFIED
                </span>
              </div>

              <Link 
                href={`https://wa.me/919600038089?text=${generateWaMessage(tail, data.tyres)}`} 
                target="_blank" 
                style={orderBtn}
              >
                ORDER SPARES FOR {tail}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// --- STYLES (PRESERVED) ---
const navBarStyle: any = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', backgroundColor: '#020617' };
const navLogoSection = { flex: '0 0 150px' };
const navTitleSection: any = { flex: '1', textAlign: 'center', minWidth: '300px' };
const navActionSection = { flex: '0 0 250px', display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' };
const responsiveMainTitle = { fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '1.5px' };
const telemetryText = { fontSize: '0.6rem', color: '#10b981', fontWeight: '800', margin: '2px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };
const pulseDot = { width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '900', fontSize: '0.65rem', whiteSpace: 'nowrap' as const, letterSpacing: '0.5px' };
const logoutBtn = { background: 'none', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' };
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
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '25px' };
const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '18px', padding: '28px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' };
const tailText = { fontSize: '1.6rem', fontWeight: '900', margin: 0, color: '#ffb400', letterSpacing: '1px' };
const modelText = { margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: '800', letterSpacing: '1px' };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '6px', fontSize: '0.55rem', fontWeight: '900', letterSpacing: '1px' };
const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const technicalRow = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', backgroundColor: '#161d2f', borderRadius: '10px' };
const posCodeBox = { width: '32px', height: '32px', backgroundColor: '#020617', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1e293b' };
const makeLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1' };
const pnLabel = { fontSize: '0.55rem', fontWeight: '600', color: '#64748b' };
const assetProgressWrapper = { flexGrow: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '10px' };
const techDataColumn = { display: 'flex', flexDirection: 'column' as const, textAlign: 'right' as const, minWidth: '85px' };
const columnHeader = { fontSize: '0.45rem', fontWeight: '900', color: '#64748b', letterSpacing: '0.5px' };
const columnValue = { fontSize: '0.75rem', fontWeight: '900' };
const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: 'transparent', color: '#ffb400', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', fontSize: '0.7rem', marginTop: '24px', border: '1px solid #ffb400' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '4px' };