'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE
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
  schoolName: string; // Dereferenced string
  organization: string; // Dereferenced string
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
    
    // Auth Check
    const userRole = localStorage.getItem('jedo_user_role')
    if (userRole !== 'ADMIN') {
      // router.push('/login')
    }

    async function fetchMasterData() {
      try {
        // THE MASTER QUERY: Using "->" to dereference School and Aircraft links
        const data = await client.fetch(`
          *[_type == "fleetRecord" && status == "active"] {
            _id,
            "tailNumber": aircraft->tailNumber,
            "aircraftModel": aircraft->model,
            "schoolName": schoolName->name,
            "organization": schoolName->organization,
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

  // 2. LOGIC HELPERS
  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / (max || 1)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  const filteredAssets = useMemo(() => 
    selectedSchool ? assets.filter(a => a.schoolName === selectedSchool) : assets
  , [assets, selectedSchool]);

  const salesLeads = useMemo(() => 
    assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20)
  , [assets]);

  // 3. REPORT GENERATOR
  const downloadGlobalReport = () => {
    const headers = ["School", "Organization", "Tail", "Model", "Pos", "S/N", "P/N", "Landings", "Max", "Health%"];
    const rows = assets.map(a => [
      a.schoolName || "Unknown", a.organization || "N/A", a.tailNumber, a.aircraftModel, 
      a.tyrePosition, a.serialNumber, a.partNumber, a.currentLandings, a.maxDesignLife,
      calculateHealth(a.currentLandings, a.maxDesignLife).toFixed(0)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jedo_Global_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  }

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}>SYNCHRONIZING GLOBAL FLEET DATA...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={headerFlex}>
        <div>
          <h1 style={{ color: '#ffb400', margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px' }}>
            {selectedSchool ? `${selectedSchool.toUpperCase()} FLEET` : "MASTER INTELLIGENCE"}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
            {selectedSchool ? `Full asset breakdown for ${selectedSchool}` : "Global Network Visibility & Revenue Engine"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {selectedSchool && <button onClick={() => setSelectedSchool(null)} style={backBtn}>← GLOBAL VIEW</button>}
          <button onClick={downloadGlobalReport} style={reportBtn}>📊 EXPORT MASTER DATA</button>
        </div>
      </header>

      {/* KPI GRID */}
      <div style={kpiGrid}>
        <div style={kpiCard}>
          <span style={kpiLabel}>TOTAL ACTIVE ASSETS</span>
          <h2 style={kpiValue}>{filteredAssets.length}</h2>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>MANAGED SCHOOLS</span>
          <h2 style={kpiValue}>{new Set(assets.map(a => a.schoolName)).size}</h2>
        </div>
        <div style={{ ...kpiCard, borderLeft: '4px solid #ef4444' }}>
          <span style={kpiLabel}>GLOBAL SALES LEADS</span>
          <h2 style={{ ...kpiValue, color: '#ef4444' }}>{salesLeads.length}</h2>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>AIRCRAFT IN NETWORK</span>
          <h2 style={kpiValue}>{new Set(assets.map(a => a.tailNumber)).size}</h2>
        </div>
      </div>

      <main style={mainGrid}>
        
        {/* LEFT PANEL: SCHOOL DIRECTORY */}
        <section style={sectionBox}>
          <h3 style={sectionTitle}>OPERATOR DIRECTORY</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from(new Set(assets.map(a => a.schoolName))).filter(Boolean).map(school => (
              <div 
                key={school} 
                onClick={() => setSelectedSchool(school)} 
                style={{
                  ...schoolSelectCard, 
                  border: selectedSchool === school ? '1px solid #ffb400' : '1px solid transparent',
                  backgroundColor: selectedSchool === school ? '#1e293b' : '#161d2f'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{school}</strong>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>
                    {assets.filter(a => a.schoolName === school).length} Assets tracked
                  </p>
                </div>
                <span style={drillArrow}>→</span>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL: ASSET INTELLIGENCE */}
        <section style={sectionBox}>
          <h3 style={sectionTitle}>
            {selectedSchool ? `INVENTORY FOR ${selectedSchool}` : "GLOBAL SALES OPPORTUNITIES (<20% HEALTH)"}
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  {!selectedSchool && <th style={th}>SCHOOL</th>}
                  <th style={th}>TAIL #</th>
                  <th style={th}>POS</th>
                  <th style={th}>MODEL</th>
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
                      {!selectedSchool && (
                        <td style={{ ...td, color: '#06b6d4', fontWeight: '800', fontSize: '0.65rem' }}>
                          {asset.schoolName || '---'}
                        </td>
                      )}
                      <td style={td}><strong>{asset.tailNumber}</strong></td>
                      <td style={td}>{asset.tyrePosition}</td>
                      <td style={{ ...td, fontSize: '0.65rem', color: '#94a3b8' }}>{asset.tyreModel || 'STD'}</td>
                      <td style={td}>{asset.serialNumber || '---'}</td>
                      <td style={td}>{asset.currentLandings}/{asset.maxDesignLife}</td>
                      <td style={{ ...td, color: health < 20 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                        {health.toFixed(0)}%
                      </td>
                      <td style={td}>
                        <Link 
                          href={`https://wa.me/919600038089?text=Inquiry for ${asset.schoolName} - ${asset.tailNumber} - ${asset.tyrePosition}`} 
                          style={miniActionBtn}
                        >
                          QUOTE
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {selectedSchool && filteredAssets.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No active assets found for this school.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}

// --- STYLING (REFINED) ---
const headerFlex: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' };
const reportBtn = { backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer' };
const backBtn = { backgroundColor: 'transparent', color: '#ffb400', border: '1px solid #ffb400', padding: '10px 20px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer' };
const schoolSelectCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', borderRadius: '14px', cursor: 'pointer', transition: '0.2s all' };
const drillArrow = { color: '#ffb400', fontWeight: 'bold', fontSize: '1.2rem' };
const miniActionBtn = { backgroundColor: 'rgba(255, 180, 0, 0.1)', color: '#ffb400', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #ffb400' };

const kpiGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' };
const kpiCard = { backgroundColor: '#0b0f1a', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' };
const kpiLabel = { fontSize: '0.6rem', color: '#64748b', fontWeight: '800', letterSpacing: '1.5px' };
const kpiValue = { fontSize: '2.2rem', fontWeight: '900', margin: '8px 0 0' };

const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' };
const sectionBox = { backgroundColor: '#0b0f1a', padding: '28px', borderRadius: '18px', border: '1px solid #1e293b' };
const sectionTitle = { fontSize: '0.75rem', color: '#64748b', marginBottom: '22px', fontWeight: '900', letterSpacing: '1.5px' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };
const tableHeaderRow = { borderBottom: '2px solid #1e293b', textAlign: 'left' as const };
const th = { padding: '15px 12px', fontSize: '0.65rem', color: '#64748b', fontWeight: '900' };
const td = { padding: '15px 12px', fontSize: '0.75rem', borderBottom: '1px solid #1e293b' };
const tableRow = { backgroundColor: 'transparent' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', letterSpacing: '4px' };