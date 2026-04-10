'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACES
interface GlobalAsset {
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
  status?: string;
  schoolName: string;
  organization: string;
  lastLogin?: string; 
}

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

export default function MasterIntelligence() {
  const [assets, setAssets] = useState<GlobalAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const userRole = localStorage.getItem('jedo_user_role')
    
    // Safety check for Admin Access
    if (userRole !== 'ADMIN') {
      // router.push('/login')
    }

    async function fetchMasterData() {
      try {
        const data = await client.fetch(`
          *[_type == "fleetRecord" && status == "active"] {
            _id,
            "tailNumber": aircraft->tailNumber,
            "aircraftModel": aircraft->model,
            "schoolName": schoolName->name,
            "organization": schoolName->organization,
            "lastLogin": schoolName->lastLogin,
            manufacturer,
            tyreModel,
            partNumber,
            tyrePosition,
            currentLandings,
            maxDesignLife,
            purchasePrice,
            dailyUtilization,
            operatorEmail,
            serialNumber,
            retreadStatus,
            status
          }
        `)
        setAssets(data || [])
      } catch (e) {
        console.error("Master Sync Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchMasterData()
  }, [])

  // 2. DATA LOGIC & ANALYTICS
  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / (max || 1)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  // Filters assets based on drill-down selection
  const filteredAssets = useMemo(() => 
    selectedSchool ? assets.filter(a => a.schoolName === selectedSchool) : assets
  , [assets, selectedSchool]);

  // Identifies Sales Leads (Health < 20%)
  const salesLeads = useMemo(() => 
    filteredAssets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20)
  , [filteredAssets]);

  // 3. REPORTING ENGINE (CSV Export)
  const downloadGlobalReport = () => {
    const headers = ["School", "Tail Number", "Model", "Position", "S/N", "P/N", "Landings", "Max Life", "Health %", "Status"];
    const rows = assets.map(a => [
      a.schoolName, a.tailNumber, a.aircraftModel, a.tyrePosition, a.serialNumber, a.partNumber,
      a.currentLandings, a.maxDesignLife, calculateHealth(a.currentLandings, a.maxDesignLife).toFixed(0), a.retreadStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jedo_Fleet_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}>INITIALIZING GLOBAL INTELLIGENCE...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 4. HEADER SECTION */}
      <header style={headerFlex}>
        <div>
          <h1 style={{ color: '#ffb400', margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px' }}>
            {selectedSchool ? `DRILL-DOWN: ${selectedSchool.toUpperCase()}` : "MASTER INTELLIGENCE"}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', fontWeight: '600' }}>
            {selectedSchool ? "Viewing detailed fleet inventory for selected operator" : "Global Asset Visibility & Revenue Leads"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {selectedSchool && <button onClick={() => setSelectedSchool(null)} style={backBtn}>VIEW ALL SCHOOLS</button>}
          <button onClick={downloadGlobalReport} style={reportBtn}>📊 DOWNLOAD GLOBAL REPORT</button>
        </div>
      </header>

      {/* 5. KPI DASHBOARD */}
      <div style={kpiGrid}>
        <div style={kpiCard}>
          <span style={kpiLabel}>TOTAL ACTIVE TYRES</span>
          <h2 style={kpiValue}>{filteredAssets.length}</h2>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>MANAGED SCHOOLS</span>
          <h2 style={kpiValue}>{new Set(assets.map(a => a.schoolName)).size}</h2>
        </div>
        <div style={{ ...kpiCard, borderLeft: '4px solid #ef4444' }}>
          <span style={kpiLabel}>CRITICAL SALES LEADS</span>
          <h2 style={{ ...kpiValue, color: '#ef4444' }}>{salesLeads.length}</h2>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>MANAGED AIRCRAFT</span>
          <h2 style={kpiValue}>{new Set(filteredAssets.map(a => a.tailNumber)).size}</h2>
        </div>
      </div>

      <main style={mainGrid}>
        
        {/* 6. LEFT SIDEBAR: SCHOOL DRILL-DOWN */}
        {!selectedSchool && (
          <section style={sectionBox}>
            <h3 style={sectionTitle}>OPERATOR DIRECTORY</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from(new Set(assets.map(a => a.schoolName))).map(school => (
                <div key={school} onClick={() => setSelectedSchool(school)} style={schoolSelectCard}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{school}</strong>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>
                      {assets.filter(a => a.schoolName === school).length} Assets Under Management
                    </p>
                  </div>
                  <span style={drillArrow}>→</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. DATA TABLE: LEAD FEED OR DETAILED FLEET */}
        <section style={{ ...sectionBox, gridColumn: selectedSchool ? '1 / span 2' : 'unset' }}>
          <h3 style={sectionTitle}>{selectedSchool ? "DETAILED FLEET AUDIT" : "GLOBAL CRITICAL LEADS"}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={th}>SCHOOL</th>
                  <th style={th}>TAIL #</th>
                  <th style={th}>POS</th>
                  <th style={th}>S/N</th>
                  <th style={th}>LANDINGS</th>
                  <th style={th}>HEALTH</th>
                  <th style={th}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {(selectedSchool ? filteredAssets : salesLeads).map(asset => {
                  const health = calculateHealth(asset.currentLandings, asset.maxDesignLife);
                  return (
                    <tr key={asset._id} style={tableRow}>
                      <td style={{ ...td, fontSize: '0.65rem', color: '#06b6d4', fontWeight: '800' }}>{asset.schoolName}</td>
                      <td style={td}><strong>{asset.tailNumber}</strong></td>
                      <td style={td}>{asset.tyrePosition}</td>
                      <td style={td}>{asset.serialNumber || '---'}</td>
                      <td style={td}>{asset.currentLandings}/{asset.maxDesignLife}</td>
                      <td style={{ ...td, color: health < 20 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                        {health.toFixed(0)}%
                      </td>
                      <td style={td}>
                        <Link href={`https://wa.me/919600038089?text=Quote Request for ${asset.schoolName} - ${asset.tailNumber}`} style={miniActionBtn}>
                          ORDER
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  )
}

// --- STYLING (PRESERVED & ENHANCED) ---
const headerFlex: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' };
const reportBtn = { backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', letterSpacing: '0.5px' };
const backBtn = { backgroundColor: 'transparent', color: '#ffb400', border: '1px solid #ffb400', padding: '10px 20px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer' };
const schoolSelectCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161d2f', padding: '18px', borderRadius: '14px', cursor: 'pointer', transition: '0.2s all', border: '1px solid rgba(255,255,255,0.03)' };
const drillArrow = { color: '#ffb400', fontWeight: 'bold', fontSize: '1.2rem' };
const miniActionBtn = { backgroundColor: 'rgba(255, 180, 0, 0.1)', color: '#ffb400', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #ffb400' };

const kpiGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' };
const kpiCard = { backgroundColor: '#0b0f1a', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' };
const kpiLabel = { fontSize: '0.6rem', color: '#64748b', fontWeight: '800', letterSpacing: '1.5px' };
const kpiValue = { fontSize: '2.2rem', fontWeight: '900', margin: '8px 0 0' };

const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' };
const sectionBox = { backgroundColor: '#0b0f1a', padding: '28px', borderRadius: '18px', border: '1px solid #1e293b' };
const sectionTitle = { fontSize: '0.75rem', color: '#64748b', marginBottom: '22px', fontWeight: '900', letterSpacing: '1.5px' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };
const tableHeaderRow = { borderBottom: '2px solid #1e293b', textAlign: 'left' as const };
const th = { padding: '15px 12px', fontSize: '0.65rem', color: '#64748b', fontWeight: '900' };
const td = { padding: '15px 12px', fontSize: '0.75rem', borderBottom: '1px solid #1e293b' };
const tableRow = { backgroundColor: 'transparent' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', letterSpacing: '4px', fontSize: '1rem' };