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
  operatorEmail: string;
  serialNumber?: string;
  retreadStatus?: string;
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
          `*[_type == "fleetRecord" && schoolName->organization == $org && status == "active"] | order(tailNumber asc)`,
          { org: storedOrg }
        )
        setAssets(data || [])
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchFleet()
  }, [router])

  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  const groupedFleet = assets.reduce((acc, asset) => {
    if (!acc[asset.tailNumber]) acc[asset.tailNumber] = { model: asset.aircraftModel, tyres: [] };
    acc[asset.tailNumber].tyres.push(asset);
    return acc;
  }, {} as Record<string, { model: string, tyres: FleetAsset[] }>);

  const avgFleetHealth = assets.length > 0 
    ? (assets.reduce((sum, a) => sum + calculateHealth(a.currentLandings, a.maxDesignLife), 0) / assets.length).toFixed(0)
    : 0;

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}><p>INITIALIZING FLEET COMMAND...</p></div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .nav-bar { padding: 10px !important; flex-direction: column !important; }
          .main-title { font-size: 0.85rem !important; }
          .summary-grid { grid-template-columns: 1fr 1fr !important; }
          .fleet-grid { grid-template-columns: 1fr !important; padding: 10px !important; }
          .aircraft-card { margin-bottom: 15px !important; }
        }
      `}} />

      <nav className="nav-bar" style={navBarStyle}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '20px' }} />
        <div style={{ textAlign: 'center' }}>
          <h1 className="main-title" style={responsiveMainTitle}>
            <span style={{ color: '#06b6d4' }}>{orgName.toUpperCase()}</span> / FLEET COMMAND
          </h1>
          <p style={telemetryText}>● LIVE SYNC: {lastSync}</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
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

          {/* ADDED TOTAL ASSETS CARD FOR MOBILE */}
          <div style={{ ...summaryCard, gridColumn: 'span 2', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={summaryLabel}>TOTAL OPERATIONAL ASSETS</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#06b6d4' }}>{Object.keys(groupedFleet).length} UNITS</span>
          </div>
        </div>
      </section>

      <main style={{ padding: '20px' }}>
        <div className="fleet-grid" style={fleetGrid}>
          {Object.entries(groupedFleet).map(([tail, data]) => (
            <div key={tail} style={aircraftCard}>
              <div style={aircraftHeader}>
                <h2 style={tailText}>{tail}</h2>
                <span style={activeBadge}>LIVE</span>
              </div>
              {data.tyres.map((tyre) => {
                const health = calculateHealth(tyre.currentLandings, tyre.maxDesignLife);
                return (
                  <div key={tyre._id} style={technicalRow}>
                    <div style={{ flexGrow: 1 }}>
                      <span style={makeLabel}>{tyre.tyrePosition}: {tyre.manufacturer}</span>
                      <div style={assetProgressWrapper}><div style={{ height: '100%', width: `${health}%`, backgroundColor: health < 20 ? '#ef4444' : '#10b981', borderRadius: '10px' }} /></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={columnHeader}>LNDG REMAINING</span>
                      <p style={{ margin: 0, fontWeight: '900', color: health < 20 ? '#ef4444' : 'white' }}>{tyre.maxDesignLife - tyre.currentLandings}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Styles
const navBarStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#020617' };
const responsiveMainTitle = { fontSize: '1rem', fontWeight: '900', margin: 0 };
const telemetryText = { fontSize: '0.55rem', color: '#10b981', margin: '2px 0 0' };
const navActionBtn = { backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '800', fontSize: '0.65rem' };
const logoutBtn = { background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', fontSize: '0.65rem' };
const summaryPanel = { backgroundColor: '#0b0f1a', padding: '20px' };
const summaryGrid = { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' };
const summaryCard = { backgroundColor: '#161d2f', padding: '15px', borderRadius: '10px' };
const summaryLabel = { fontSize: '0.55rem', fontWeight: '800', color: '#64748b' };
const summaryValue = { fontSize: '1.6rem', margin: '5px 0 0', fontWeight: '900' };
const progressBase = { flexGrow: 1, height: '6px', backgroundColor: '#0f172a', borderRadius: '10px' };
const fleetGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '15px' };
const aircraftCard = { backgroundColor: '#0b0f1a', borderRadius: '12px', padding: '15px', border: '1px solid #1e293b' };
const aircraftHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };
const tailText = { fontSize: '1.2rem', fontWeight: '900', color: '#ffb400', margin: 0 };
const activeBadge = { color: '#10b981', fontSize: '0.55rem', fontWeight: '900' };
const technicalRow = { display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#161d2f', borderRadius: '8px', marginBottom: '8px' };
const makeLabel = { fontSize: '0.7rem', fontWeight: '700' };
const assetProgressWrapper = { height: '4px', backgroundColor: '#1e293b', borderRadius: '10px', marginTop: '4px' };
const columnHeader = { fontSize: '0.45rem', color: '#64748b' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400' };