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

  // --- ARCHITECT LOGIC: COLOR CALCULATOR ---
  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  const getHealthColor = (health: number) => {
    if (health < 20) return '#ef4444'; // Red (Critical)
    if (health < 50) return '#f59e0b'; // Amber (Warning)
    return '#10b981'; // Green (Healthy)
  }

  const groupedFleet = assets.reduce((acc, asset) => {
    if (!acc[asset.tailNumber]) {
      acc[asset.tailNumber] = { model: asset.aircraftModel, tyres: [] };
    }
    acc[asset.tailNumber].tyres.push(asset);
    return acc;
  }, {} as Record<string, { model: string, tyres: FleetAsset[] }>);

  const avgFleetHealth = assets.length > 0 
    ? Number((assets.reduce((sum, a) => sum + calculateHealth(a.currentLandings, a.maxDesignLife), 0) / assets.length).toFixed(0))
    : 0;

  const generateWaMessage = (tail: string, tyres: FleetAsset[]) => {
    const posCodeMap: Record<string, string> = { 'Nose Gear': 'N', 'Main Left': 'ML', 'Main Right': 'MR' };
    let msg = `*JEDO TECH COMPLIANCE REPORT*\n*AIRCRAFT:* ${tail}\n\n`;

    tyres.forEach(t => {
      const health = calculateHealth(t.currentLandings, t.maxDesignLife);
      const status = health < 20 ? '🚨 CRITICAL' : health < 50 ? '⚠️ WARNING' : '✅ OK';
      msg += `${status} | Pos: ${posCodeMap[t.tyrePosition || ''] || '??'}\nRem: ${Math.max(0, t.maxDesignLife - t.currentLandings)} Lndg\n\n`;
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
            <span style={{ color: '#06b6d4' }}>{orgName.toUpperCase()}</span> 
            <span style={{ color: '#475569', margin: '0 15px', fontWeight: '300' }}>/</span> 
            <span style={{ color: '#f8fafc' }}>FLEET COMMAND</span>
          </h1>
          <p style={telemetryText}><span style={pulseDot}></span> LIVE TELEMETRY SYNC: {lastSync}</p>
        </div>

        <div style={navActionSection}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOGBOOK</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <section style={summaryPanel}>
        <div style={summaryGrid}>
          <div style={summaryCard}>
            <span style={summaryLabel}>FLEET HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <h2 style={{ ...summaryValue, color: getHealthColor(avgFleetHealth) }}>{avgFleetHealth}%</h2>
                <div style={progressBase}>
                    <div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: getHealthColor(avgFleetHealth), borderRadius: '10px' }} />
                </div>
            </div>
          </div>
          
          <div style={{ ...summaryCard, borderLeft: '4px solid #ef4444' }}>
            <span style={summaryLabel}>CRITICAL (AOG RISK)</span>
            <h2 style={{ ...summaryValue, color: '#ef4444' }}>{assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20).length}</h2>
          </div>

          <div style={{ ...summaryCard, borderLeft: '4px solid #f59e0b' }}>
            <span style={summaryLabel}>WATCHLIST (WARNING)</span>
            <h2 style={{ ...summaryValue, color: '#f59e0b' }}>{assets.filter(a => { const h = calculateHealth(a.currentLandings, a.maxDesignLife); return h >= 20 && h < 50; }).length}</h2>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>TOTAL UNITS</span>
            <h2 style={summaryValue}>{assets.length}</h2>
          </div>
        </div>
      </section>

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
                  const statusColor = getHealthColor(health);
                  const remaining = Math.max(0, tyre.maxDesignLife - tyre.currentLandings);
                  const posCode = { 'Nose Gear': 'N', 'Main Left': 'ML', 'Main Right': 'MR' }[tyre.tyrePosition || ''] || '??';

                  return (
                    <div key={tyre._id} style={{ ...technicalRow, borderLeft: `3px solid ${statusColor}` }}>
                      <div style={posCodeBox}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: statusColor }}>{posCode}</span>
                      </div>
                      
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={makeLabel}>{tyre.manufacturer}</span>
                            <span style={pnLabel}>S/N: {tyre.serialNumber || 'TBD'}</span>
                        </div>
                        <div style={assetProgressWrapper}>
                          <div style={{ height: '100%', width: `${health}%`, backgroundColor: statusColor, borderRadius: '10px' }} />
                        </div>
                        {health < 20 && <p style={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold', marginTop: '4px' }}>⚠️ IMMEDIATE REPLACEMENT REQUIRED</p>}
                      </div>

                      <div style={techDataColumn}>
                        <span style={columnHeader}>REMAINING</span>
                        <span style={{ ...columnValue, color: statusColor }}>{remaining} LNDG</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link 
                href={`https://wa.me/919600038089?text=${generateWaMessage(tail, data.tyres)}`} 
                target="_blank" 
                style={{ ...orderBtn, borderColor: '#ffb400', color: '#ffb400' }}
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

// --- STYLES ---
const navBarStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', backgroundColor: '#020617' };
const navLogoSection = { flex: '0 0 150px' };
const navTitleSection: any = { flex: '1', textAlign: 'center' };
const navActionSection = { flex: '0 0 250px', display: 'flex', gap: '12px', justifyContent: 'flex-end' };
const responsiveMainTitle = { fontSize: '1.2rem', fontWeight: '900', margin: 0 };
const telemetryText = { fontSize: '0.6rem', color: '#10b981', fontWeight: '800', margin: '2px 0 0' };
const pulseDot = { width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '900', fontSize: '0.65rem' };
const logoutBtn = { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem' };
const summaryPanel = { backgroundColor: '#0b0f1a', padding: '40px', borderBottom: '1px solid #1e293b' };
const summaryGrid = { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '24px', borderRadius: '14px' };
const summaryLabel = { fontSize: '0.65rem', fontWeight: '900', color: '#64748b' };
const summaryValue = { fontSize: '2.5rem', margin: '10px 0 0', fontWeight: '900' };
const progressBase = { flexGrow: 1, height: '8px', backgroundColor: '#0f172a', borderRadius: '10px' };
const mainContentStyle = { padding: '20px 40px', maxWidth: '1440px', margin: '0 auto' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '25px' };
const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '18px', padding: '25px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const tailText = { fontSize: '1.6rem', fontWeight: '900', margin: 0, color: '#ffb400' };
const modelText = { margin: 0, fontSize: '0.65rem', color: '#64748b' };
const activeBadge = { color: '#10b981', fontSize: '0.55rem', fontWeight: '900' };
const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
const technicalRow = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', backgroundColor: '#161d2f', borderRadius: '10px' };
const posCodeBox = { width: '32px', height: '32px', backgroundColor: '#020617', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const makeLabel = { fontSize: '0.75rem', fontWeight: '700' };
const pnLabel = { fontSize: '0.55rem', color: '#64748b' };
const assetProgressWrapper = { flexGrow: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '10px' };
const techDataColumn = { display: 'flex', flexDirection: 'column' as const, textAlign: 'right' as const, minWidth: '85px' };
const columnHeader = { fontSize: '0.45rem', fontWeight: '900', color: '#64748b' };
const columnValue = { fontSize: '0.75rem', fontWeight: '900' };
const orderBtn = { display: 'block', textAlign: 'center' as const, textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', fontSize: '0.7rem', marginTop: '24px', border: '1px solid' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400' };