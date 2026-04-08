'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// Data Interface
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

  const avgFleetHealth = assets.length > 0 
    ? (assets.reduce((sum, a) => sum + calculateHealth(a.currentLandings, a.maxDesignLife), 0) / assets.length).toFixed(0)
    : 0;

  const generateWaMessage = (tail: string, tyres: FleetAsset[]) => {
    const posCodeMap: Record<string, string> = { 'Nose Gear': 'N', 'Main Left': 'ML', 'Main Right': 'MR' };
    let msg = `*COMPLIANCE & SPARES ORDER*\n*AIRCRAFT:* ${tail}\n\n`;
    tyres.forEach(t => {
      const health = calculateHealth(t.currentLandings, t.maxDesignLife);
      msg += `${health < 20 ? '🚨' : '✅'} Pos: [${posCodeMap[t.tyrePosition || ''] || '??'}] | S/N: ${t.serialNumber || 'TBD'}\nRem: ${Math.max(0, t.maxDesignLife - t.currentLandings)} Landings\n\n`;
    });
    return encodeURIComponent(msg);
  };

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>INITIALIZING FLEET COMMAND...</p></div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: 'white' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .nav-bar { padding: 10px 15px !important; flex-direction: column !important; text-align: center !important; }
          .nav-logo { margin-bottom: 5px !important; }
          .nav-title { min-width: 100% !important; margin-bottom: 10px !important; }
          .main-title { font-size: 0.9rem !important; line-height: 1.4 !important; }
          .nav-actions { width: 100% !important; justify-content: center !important; gap: 8px !important; }
          .summary-panel { padding: 15px !important; }
          .summary-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .summary-card { padding: 15px !important; }
          .summary-value { font-size: 1.5rem !important; }
          .fleet-grid { grid-template-columns: 1fr !important; padding: 10px !important; }
          .technical-row { padding: 10px !important; flex-direction: column !important; align-items: flex-start !important; }
          .tech-data-col { text-align: left !important; width: 100% !important; margin-top: 5px !important; display: flex !important; justify-content: space-between !important; }
        }
      `}} />

      <nav className="nav-bar" style={navBarStyle}>
        <div className="nav-logo" style={navLogoSection}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '22px' }} /></Link>
        </div>

        <div className="nav-title" style={navTitleSection}>
          <h1 className="main-title" style={responsiveMainTitle}>
            <span style={{ color: '#06b6d4' }}>{orgName.toUpperCase()}</span> 
            <span style={{ color: '#475569', margin: '0 8px' }}>/</span> 
            <span style={{ color: '#f8fafc' }}>FLEET COMMAND</span>
          </h1>
          <p style={telemetryText}><span style={pulseDot}></span> LIVE TELEMETRY: {lastSync}</p>
        </div>

        <div className="nav-actions" style={navActionSection}>
          <Link href="/update-logbook" style={navActionBtn}>+ LOGBOOK</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,180,0,0.1)', width: '100%' }} />

      <section className="summary-panel" style={summaryPanel}>
        <div className="summary-grid" style={summaryGrid}>
          <div style={{ ...summaryCard, gridColumn: 'span 2' }}>
            <span style={summaryLabel}>FLEET HEALTH INDEX</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' }}>
                <h2 style={summaryValue}>{avgFleetHealth}%</h2>
                <div style={progressBase}>
                    <div style={{ height: '100%', width: `${avgFleetHealth}%`, backgroundColor: '#10b981', borderRadius: '10px' }} />
                </div>
            </div>
          </div>
          
          <div style={{ ...summaryCard, borderLeft: '3px solid #ef4444' }}>
            <span style={summaryLabel}>AOG RISK</span>
            <h2 style={{ ...summaryValue, color: '#ef4444' }}>{assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20).length}</h2>
          </div>

          <div style={{ ...summaryCard, borderLeft: '3px solid #f59e0b' }}>
            <span style={summaryLabel}>PENDING</span>
            <h2 style={{ ...summaryValue, color: '#f59e0b' }}>{assets.filter(a => { const h = calculateHealth(a.currentLandings, a.maxDesignLife); return h >= 20 && h < 50; }).length}</h2>
          </div>
        </div>
      </section>

      <main style={mainContentStyle}>
        <div className="fleet-grid" style={fleetGrid}>
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
                  const posCodeMap: any = { 'Nose Gear': 'N', 'Main Left': 'ML', 'Main Right': 'MR' };

                  return (
                    <div key={tyre._id} className="technical-row" style={technicalRow}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <div style={posCodeBox}>
                          <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#ffb400' }}>{posCodeMap[tyre.tyrePosition || ''] || '??'}</span>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={makeLabel}>{tyre.manufacturer}</span>
                              <span style={pnLabel}>S/N: {tyre.serialNumber || 'TBD'}</span>
                            </div>
                            <div style={assetProgressWrapper}>
                              <div style={{ height: '100%', width: `${health}%`, backgroundColor: color, borderRadius: '10px' }} />
                            </div>
                        </div>
                      </div>

                      <div className="tech-data-col" style={techDataColumn}>
                        <span style={columnHeader}>ACCUMULATED</span>
                        <span style={{ ...columnValue, color }}>{tyre.currentLandings}/{tyre.maxDesignLife}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link 
                href={`https://wa.me/919600038089?text=${generateWaMessage(tail, data.tyres)}`} 
                target="_blank" 
                style={orderBtn}
              >
                ORDER SPARES: {tail}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Styles preserved and optimized for mobile-first scaling
const navBarStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#020617' };
const navLogoSection = { display: 'flex', alignItems: 'center' };
const navTitleSection: any = { flex: '1', textAlign: 'center' };
const navActionSection: any = { display: 'flex', gap: '10px', alignItems: 'center' };
const responsiveMainTitle = { fontSize: '1.1rem', fontWeight: '900', margin: 0, letterSpacing: '1px' };
const telemetryText = { fontSize: '0.55rem', color: '#10b981', fontWeight: '700', margin: '2px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' };
const pulseDot = { width: '5px', height: '5px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '800', fontSize: '0.65rem' };
const logoutBtn = { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' };
const summaryPanel = { backgroundColor: '#0b0f1a', padding: '30px 40px' };
const summaryGrid = { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' };
const summaryLabel = { fontSize: '0.6rem', fontWeight: '800', color: '#64748b', letterSpacing: '1px' };
const summaryValue = { fontSize: '1.8rem', margin: '5px 0 0', fontWeight: '900' };
const progressBase = { flexGrow: 1, height: '6px', backgroundColor: '#0f172a', borderRadius: '10px' };
const mainContentStyle = { padding: '20px', maxWidth: '1200px', margin: '0 auto' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' };
const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '15px', padding: '20px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const tailText = { fontSize: '1.4rem', fontWeight: '900', margin: 0, color: '#ffb400' };
const modelText = { margin: 0, fontSize: '0.6rem', color: '#64748b', fontWeight: '700' };
const activeBadge = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', fontSize: '0.5rem', fontWeight: '800' };
const tyreContainer = { display: 'flex', flexDirection: 'column' as const, gap: '10px' };
const technicalRow = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#161d2f', borderRadius: '8px' };
const posCodeBox = { width: '28px', height: '28px', backgroundColor: '#020617', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1e293b' };
const makeLabel = { fontSize: '0.7rem', fontWeight: '700', color: '#cbd5e1' };
const pnLabel = { fontSize: '0.55rem', color: '#64748b' };
const assetProgressWrapper = { flexGrow: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '10px', marginTop: '4px' };
const techDataColumn = { display: 'flex', flexDirection: 'column' as const, textAlign: 'right' as const };
const columnHeader = { fontSize: '0.45rem', fontWeight: '800', color: '#64748b' };
const columnValue = { fontSize: '0.7rem', fontWeight: '800' };
const orderBtn = { display: 'block', textAlign: 'center' as const, backgroundColor: 'transparent', color: '#ffb400', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.65rem', marginTop: '15px', border: '1px solid #ffb400' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', fontSize: '1rem', letterSpacing: '2px' };