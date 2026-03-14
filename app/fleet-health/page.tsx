'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

// INTELLIGENCE LOGIC: Predictive wear based on landing cycles
const getStatus = (landings: number, maxLife: number = 350) => {
  const ratio = landings / maxLife;
  if (ratio > 0.85) return { label: 'CRITICAL', color: '#ef4444', bg: '#fee2e2' };
  if (ratio > 0.65) return { label: 'WARNING', color: '#f59e0b', bg: '#fef3c7' };
  return { label: 'HEALTHY', color: '#10b981', bg: '#dcfce7' };
}

export default function FleetHealthPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [clientEmail, setClientEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 1. AUTH CHECK: Ensure user is logged in
    const email = localStorage.getItem('client_email');
    if (!email) {
      router.push('/login');
      return;
    }
    setClientEmail(email);

    const fetchLifecycleData = async () => {
      try {
        // 2. FILTERED QUERY: Only fetch tyres assigned to this email
        const query = `*[_type == "part" && clientEmail == "${email}"] {
          _id,
          partNumber,
          aircraftType,
          priceUSD,
          "landings": coalesce(totalLandings, 0),
          "retreads": coalesce(retreadHistory, 0),
          "maxLife": coalesce(maxDesignLife, 350),
          serialNumber
        }`
        const data = await client.fetch(query)
        setAssets(data)
      } catch (error) {
        console.error("Health Data Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLifecycleData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('client_email');
    router.push('/login');
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* TOP NAVIGATION */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#002d5b', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Jedotech</Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Logged in as: <strong>{clientEmail}</strong></span>
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </nav>

      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Fleet Health Intelligence</h1>
        <p style={{ color: '#64748b' }}>Predictive lifecycle tracking and Cost Per Landing (CPL) analytics.</p>
      </header>

      {/* DASHBOARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        {loading ? (
          <p>Analyzing Fleet Data...</p>
        ) : assets.length > 0 ? (
          assets.map((asset) => {
            const status = getStatus(asset.landings, asset.maxLife);
            const cpl = asset.landings > 0 ? (asset.priceUSD / asset.landings).toFixed(2) : 'N/A';

            return (
              <div key={asset._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{asset.aircraftType}</h2>
                    <code style={{ fontSize: '0.8rem', color: '#64748b' }}>S/N: {asset.serialNumber || 'PENDING'}</code>
                  </div>
                  <span style={{ ...badgeStyle, color: status.color, backgroundColor: status.bg }}>
                    {status.label}
                  </span>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Total Landings</label>
                    <div style={valueStyle}>{asset.landings}</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Retread Level</label>
                    <div style={valueStyle}>R-{asset.retreads}</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Cost Per Landing</label>
                    <div style={{ ...valueStyle, color: '#002d5b' }}>${cpl}</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Part Spec</label>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1e293b' }}>{asset.partNumber}</div>
                  </div>
                </div>

                {/* VISUAL PROGRESS BAR */}
                <div style={{ marginTop: '25px', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min((asset.landings / asset.maxLife) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: status.color,
                    transition: 'width 1s ease-in-out'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                   <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>0 Landings</p>
                   <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Limit: {asset.maxLife}</p>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px' }}>
             <h3 style={{ color: '#002d5b' }}>No Tyres Registered</h3>
             <p style={{ color: '#64748b' }}>Contact Jedo Technologies to link your fleet serial numbers to this portal.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// CSS-IN-JS STYLES
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0' };
const badgeStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const valueStyle = { fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' };
const logoutBtnStyle = { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' as const };