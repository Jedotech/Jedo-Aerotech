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

export default function AviationIntelligence() {
  const [reportData, setReportData] = useState<any>({
    totalLandings: 0,
    brandPerformance: {},
    failureReasons: {},
    totalAssets: 0,
    aogRiskCount: 0,
    urgentProcurement: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const STATIC_RATE = 84.00;

  useEffect(() => {
    const isAuthorized = localStorage.getItem('fleet_access')
    const storedOrg = localStorage.getItem('fleet_user_org')
    
    if (!isAuthorized || !storedOrg) {
      router.push('/login')
      return
    }

    async function generateReport() {
      try {
        const allData = await client.fetch(
          `*[_type == "fleetRecord" && schoolName->organization == $org]`,
          { org: storedOrg }
        )

        const stats = allData.reduce((acc: any, asset: any) => {
          const landings = asset.currentLandings || 0;
          acc.totalLandings += landings;
          acc.totalAssets += 1;

          if (!acc.brandPerformance[asset.manufacturer]) {
            acc.brandPerformance[asset.manufacturer] = { count: 0, totalLndg: 0 };
          }
          acc.brandPerformance[asset.manufacturer].count += 1;
          acc.brandPerformance[asset.manufacturer].totalLndg += landings;

          if (asset.status === 'retired') {
            const reason = asset.removalReason || 'Normal Wear';
            acc.failureReasons[reason] = (acc.failureReasons[reason] || 0) + 1;
          }

          const remainingLandings = (asset.maxDesignLife || 0) - landings;
          if (remainingLandings < 20 && asset.status === 'active') {
            acc.aogRiskCount += 1;
          }

          if (asset.dailyUtilization > 0 && asset.status === 'active') {
            const daysLeft = Math.floor(remainingLandings / asset.dailyUtilization);
            if (daysLeft < 7) acc.urgentProcurement += 1;
          }

          return acc;
        }, { 
          totalLandings: 0, totalAssets: 0, brandPerformance: {}, 
          failureReasons: {}, aogRiskCount: 0, urgentProcurement: 0 
        });

        setReportData(stats);
      } catch (e) { 
        console.error("Analytics Engine Error:", e) 
      } finally { 
        setLoading(false) 
      }
    }
    generateReport()
  }, [router])

  // --- ARCHITECT'S EXPORT LOGIC ---
  const handleExport = () => {
    window.print();
  }

  if (loading) return <div style={loaderStyle}>GENERATING INTELLIGENCE REPORT...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* CSS Injection for Print Formatting */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          div { border-color: #e2e8f0 !important; }
          h1, h2, h3, span, p { color: black !important; }
          span[style*="color: rgb(6, 182, 212)"] { color: #0891b2 !important; }
        }
      `}} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            FLEET <span style={{ color: '#ffb400' }}>INTELLIGENCE</span> REPORT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '2px', marginTop: '5px' }}>
            DATA-DRIVEN PERFORMANCE ANALYSIS
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} style={exportButtonStyle}>📥 EXPORT TO PDF</button>
          <Link href="/fleet-health" style={backButtonStyle}>RETURN TO COMMAND</Link>
        </div>
      </header>

      <div style={kpiGrid}>
        <div style={kpiCard}>
          <span style={kpiLabel}>TOTAL MANAGED LANDINGS</span>
          <h2 style={kpiValue}>{reportData.totalLandings.toLocaleString()}</h2>
          <p style={subLabel}>CUMULATIVE FLEET EXPERIENCE</p>
        </div>
        
        <div style={{ ...kpiCard, borderLeft: '4px solid #ef4444' }}>
          <span style={kpiLabel}>AOG RISK (CRITICAL)</span>
          <h2 style={{ ...kpiValue, color: '#ef4444' }}>{reportData.aogRiskCount}</h2>
          <p style={subLabel}>ASSETS BELOW 20 LANDINGS</p>
        </div>

        <div style={{ ...kpiCard, borderLeft: '4px solid #ffb400' }}>
          <span style={kpiLabel}>PROCUREMENT ALERTS</span>
          <h2 style={{ ...kpiValue, color: '#ffb400' }}>{reportData.urgentProcurement}</h2>
          <p style={subLabel}>EST. DEPLETION WITHIN 7 DAYS</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        
        <div style={analyticsBox}>
          <h3 style={boxTitle}>BRAND PERFORMANCE (AVG LANDINGS)</h3>
          {Object.entries(reportData.brandPerformance).map(([brand, data]: any) => (
            <div key={brand} style={dataRow}>
              <span style={{ fontWeight: '700' }}>{brand}</span>
              <span style={{ color: '#06b6d4', fontWeight: '900' }}>
                {data.count > 0 ? (data.totalLndg / data.count).toFixed(0) : 0} LNDG
              </span>
            </div>
          ))}
        </div>

        <div style={analyticsBox}>
          <h3 style={boxTitle}>REMOVAL REASON DISTRIBUTION</h3>
          {Object.keys(reportData.failureReasons).length > 0 ? (
            Object.entries(reportData.failureReasons).map(([reason, count]: any) => (
              <div key={reason} style={dataRow}>
                <span style={{ fontWeight: '700' }}>{reason}</span>
                <span style={{ color: reason === 'Normal Wear' ? '#10b981' : '#ef4444', fontWeight: '900' }}>{count} ASSETS</span>
              </div>
            ))
          ) : (
             <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: '20px' }}>No retired assets for distribution analysis.</p>
          )}
        </div>
      </div>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #1e293b', paddingTop: '20px', textAlign: 'center' }}>
         <p style={{ fontSize: '0.55rem', color: '#475569', letterSpacing: '1px' }}>
            CONFIDENTIAL - JEDO TECHNOLOGIES AVIATION ANALYTICS ENGINE v1.0
         </p>
      </footer>
    </div>
  )
}

// --- STYLES PRESERVED ---
const kpiGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };
const kpiCard = { backgroundColor: '#0b0f1a', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' };
const kpiLabel = { fontSize: '0.6rem', fontWeight: '900', color: '#64748b', letterSpacing: '1px' };
const kpiValue = { fontSize: '1.8rem', fontWeight: '900', margin: '10px 0 0', color: '#f8fafc' };
const subLabel = { fontSize: '0.5rem', color: '#475569', marginTop: '4px', fontWeight: '700' };
const analyticsBox = { backgroundColor: '#0b0f1a', padding: '30px', borderRadius: '12px', border: '1px solid #1e293b' };
const boxTitle = { fontSize: '0.7rem', fontWeight: '900', color: '#64748b', letterSpacing: '1.5px', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' };
const dataRow = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' };
const backButtonStyle = { backgroundColor: 'transparent', color: '#ffb400', textDecoration: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', border: '1px solid #ffb400' };
const exportButtonStyle = { backgroundColor: '#ffb400', color: '#020617', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer' };
const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', letterSpacing: '3px' };