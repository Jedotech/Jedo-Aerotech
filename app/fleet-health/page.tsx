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
        // DYNAMIC REFERENCE QUERY: 
        // We use schoolName->organization to follow the link from the aircraft to the User document
        const data = await client.fetch(
          `*[_type == "fleetRecord" && schoolName->organization == $org] | order(tailNumber asc)`,
          { org: storedOrg || 'Authorized Operator' }
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

  const handleLogout = () => {
    localStorage.removeItem('fleet_access')
    localStorage.removeItem('fleet_user_org')
    router.push('/login')
  }

  const calculateCPL = (price: number | undefined, maxLandings: number) => {
    const safeMax = maxLandings || 250;
    if (!price || safeMax === 0) return "N/A";
    return `$${(price / safeMax).toFixed(2)}`; 
  }

  const calculateDaysRemaining = (current: number, max: number, daily: number | undefined) => {
    const safeDaily = daily || 0;
    if (safeDaily <= 0) return "SET UTILIZATION";
    const remaining = (max || 250) - (current || 0);
    const days = Math.floor(remaining / safeDaily);
    return days <= 0 ? "REPLACE NOW" : `${days} DAYS`;
  }

  const calculateHealth = (current: number, max: number) => {
    const totalMax = max || 250;
    const percentage = ((totalMax - (current || 0)) / totalMax) * 100;
    return Math.max(0, Math.min(100, percentage)).toFixed(1);
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div style={loaderStyle}>
        <p>SYNCING JEDO INTELLIGENCE...</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <Link href="/marketplace" style={navLinkStyle}>PROCUREMENT</Link>
            
            <Link 
              href="/update-logbook" 
              style={{ 
                ...navLinkStyle, 
                backgroundColor: '#ffb400', 
                color: '#001a35', 
                padding: '6px 14px', 
                borderRadius: '6px' 
              }}
            >
              UPDATE LOGBOOK
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={statusBadge}>LIVE FLEET PULSE</div>
          <button onClick={handleLogout} style={logoutBtnStyle}>LOGOUT</button>
        </div>
      </nav>

      {/* HEADER */}
      <header style={{ padding: '60px 40px 30px', maxWidth: '1440px', margin: '0 auto' }}>
        <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2.2rem', margin: 0 }}>
          {orgName.toUpperCase()} <span style={{ color: '#ffb400' }}>FLEET INTEL</span>
        </h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div style={summaryTag}>ASSETS UNDER MONITORING: {assets.length}</div>
          <div style={summaryTag}>HUB: CHENNAI (MAA)</div>
        </div>
      </header>

      {/* ASSET GRID */}
      <main style={{ padding: '0 40px 80px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={gridStyle}>
          {assets.map((asset) => {
            const healthVal = parseFloat(calculateHealth(asset.currentLandings, asset.maxDesignLife))
            const daysLeft = calculateDaysRemaining(asset.currentLandings, asset.maxDesignLife, asset.dailyUtilization)
            const statusColor = healthVal < 20 ? '#ef4444' : healthVal < 45 ? '#f59e0b' : '#10b981';

            const waMessage = encodeURIComponent(
              `Jedo Intelligence Alert!\n\n` +
              `Requesting Quote for:\n` +
              `Aircraft: ${asset.tailNumber}\n` +
              `Position: ${asset.tyrePosition || 'N/A'}\n` +
              `Make: ${asset.manufacturer || 'Unspecified'}\n` +
              `Model: ${asset.tyreModel || 'N/A'}\n` +
              `P/N: ${asset.partNumber || 'TBD'}\n\n` +
              `Current Health: ${healthVal}% Life Remaining.`
            );

            return (
              <div key={asset._id} style={{ ...cardStyle, borderColor: '#001a35' }}>
                <div style={cardHeader}>
                  <div>
                    <span style={{ ...typeBadge, color: statusColor }}>{asset.tailNumber}</span>
                    <h3 style={tailTitle}>{asset.manufacturer || 'Make'} {asset.tyreModel || 'Model'}</h3>
                    <p style={partNumberLabel}>P/N: {asset.partNumber || 'PENDING'}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0', fontWeight: 'bold' }}>
                      {asset.tyrePosition?.toUpperCase()} | {asset.aircraftModel}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...healthBadge, color: statusColor, borderColor: statusColor }}>
                      {healthVal}% LIFE
                    </div>
                  </div>
                </div>

                <div style={{ ...countdownBox, backgroundColor: healthVal < 20 ? '#fff1f2' : '#f8fafc' }}>
                   <span style={label}>ESTIMATED GROUNDING IN</span>
                   <span style={{ ...countdownValue, color: statusColor }}>{daysLeft}</span>
                </div>

                <div style={intelGrid}>
                  <div style={intelBox}>
                    <span style={label}>COST / LANDING</span>
                    <span style={intelValue}>{calculateCPL(asset.purchasePrice, asset.maxDesignLife)}</span>
                  </div>
                  <div style={intelBox}>
                    <span style={label}>TOTAL LANDINGS</span>
                    <span style={intelValue}>{asset.currentLandings || 0}</span>
                  </div>
                </div>

                <div style={progressWrapper}>
                  <div style={{ ...progressFill, width: `${healthVal}%`, backgroundColor: statusColor }}></div>
                </div>

                <div style={cardFooter}>
                  <div style={ownerSection}>
                    <span style={label}>OPERATOR EMAIL</span>
                    <span style={ownerEmail}>{asset.operatorEmail || 'Inquiry@jedotech.com'}</span>
                  </div>
                  <Link 
                    href={`https://wa.me/919600038089?text=${waMessage}`} 
                    target="_blank"
                    style={{ 
                      ...orderBtn, 
                      backgroundColor: healthVal < 45 ? '#ffb400' : '#001a35',
                      color: healthVal < 45 ? '#001a35' : '#ffffff'
                    }}
                  >
                    {healthVal < 45 ? 'ORDER NOW' : 'MONITORING'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

// --- STYLING (RETAINED) ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#001a35' };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold' as const };
const statusBadge = { color: '#ffb400', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #ffb400', padding: '4px 12px', borderRadius: '4px' };
const logoutBtnStyle = { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 15px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' as const, cursor: 'pointer' };
const summaryTag = { backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' as const, color: '#64748b', border: '1px solid #e2e8f0' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1.5px solid' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
const typeBadge = { fontSize: '0.8rem', fontWeight: '900' as const, letterSpacing: '1px' };
const tailTitle = { margin: '5px 0 0 0', fontSize: '1.25rem', color: '#001a35', fontWeight: '900' as const };
const partNumberLabel = { fontSize: '0.7rem', fontWeight: 'bold' as const, color: '#ffb400', margin: '2px 0' };
const healthBadge = { padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: '900' as const, border: '2px solid' };
const countdownBox = { padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', marginBottom: '20px' };
const countdownValue = { fontSize: '1.6rem', fontWeight: '900' as const, marginTop: '5px' };
const intelGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' };
const intelBox = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center' as const };
const intelValue = { display: 'block', fontSize: '1.1rem', fontWeight: '900' as const, color: '#001a35', marginTop: '4px' };
const progressWrapper = { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' as const, marginBottom: '25px' };
const progressFill = { height: '100%', transition: 'all 0.8s ease' };
const cardFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' };
const ownerSection = { display: 'flex', flexDirection: 'column' as const };
const ownerEmail = { fontSize: '0.7rem', fontWeight: '700' as const, color: '#001a35' };
const orderBtn = { textDecoration: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900' as const };
const label = { fontSize: '0.6rem', fontWeight: '900' as const, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' as const };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400', fontWeight: 'bold', letterSpacing: '3px' };