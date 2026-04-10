'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACES
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
  status?: string;
}

interface GlobalAsset extends FleetAsset {
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
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // SECURITY: Ensure only Jedo Admins can access this
    const userRole = localStorage.getItem('jedo_user_role')
    if (userRole !== 'ADMIN') {
      // For now, if you haven't implemented roles, we'll let you in, 
      // but in production, uncomment the line below:
      // router.push('/login'); return;
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
  }, [router])

  // 2. INTELLIGENCE CALCULATIONS
  const calculateHealth = (current: number, max: number) => {
    const percentage = ((max - (current || 0)) / (max || 1)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  // REVENUE ENGINE: High-priority sales leads (< 20% health)
  const salesLeads = useMemo(() => 
    assets.filter(a => calculateHealth(a.currentLandings, a.maxDesignLife) < 20)
  , [assets]);

  // STRATEGIC SOURCING: Bulk Aggregator
  const bulkRequirements = useMemo(() => {
    return salesLeads.reduce((acc, asset) => {
      const pn = asset.partNumber || 'TBD';
      if (!acc[pn]) acc[pn] = { count: 0, schools: new Set<string>() };
      acc[pn].count += 1;
      acc[pn].schools.add(asset.schoolName);
      return acc;
    }, {} as Record<string, { count: number, schools: Set<string> }>);
  }, [salesLeads]);

  if (!mounted) return null
  if (loading) return <div style={loaderStyle}>INITIALIZING GOD VIEW...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px' }}>
      
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <h1 style={{ color: '#ffb400', margin: 0, fontSize: '1.8rem', fontWeight: '900' }}>MASTER INTELLIGENCE</h1>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>GLOBAL FLEET VISIBILITY & REVENUE ENGINE</p>
      </header>

      {/* KPI GRID */}
      <div style={kpiGrid}>
        <div style={kpiCard}>
          <span style={kpiLabel}>TOTAL AIRCRAFT</span>
          <h2 style={kpiValue}>{new Set(assets.map(a => a.tailNumber)).size}</h2>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>ACTIVE SCHOOLS</span>
          <h2 style={kpiValue}>{new Set(assets.map(a => a.organization)).size}</h2>
        </div>
        <div style={{ ...kpiCard, borderLeft: '4px solid #ef4444' }}>
          <span style={kpiLabel}>SALES LEADS (CRITICAL)</span>
          <h2 style={{ ...kpiValue, color: '#ef4444' }}>{salesLeads.length}</h2>
        </div>
        <div style={{ ...kpiCard, borderLeft: '4px solid #06b6d4' }}>
          <span style={kpiLabel}>BULK P/N GROUPS</span>
          <h2 style={{ ...kpiValue, color: '#06b6d4' }}>{Object.keys(bulkRequirements).length}</h2>
        </div>
      </div>

      <div style={mainGrid}>
        
        {/* LEFT COLUMN: STRATEGIC SOURCING */}
        <section style={sectionBox}>
          <h3 style={sectionTitle}>STRATEGIC SOURCING (BULK ORDERS)</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRow}>
                <th style={th}>PART NUMBER</th>
                <th style={th}>QTY</th>
                <th style={th}>SCHOOLS</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(bulkRequirements).map(([pn, data]) => (
                <tr key={pn} style={tableRow}>
                  <td style={td}><strong>{pn}</strong></td>
                  <td style={{ ...td, color: '#ffb400', fontWeight: 'bold' }}>{data.count}</td>
                  <td style={{ ...td, fontSize: '0.65rem' }}>{Array.from(data.schools).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* RIGHT COLUMN: REVENUE ENGINE (SALES LEADS) */}
        <section style={sectionBox}>
          <h3 style={sectionTitle}>SALES LEADS (REPLACEMENT NEEDED)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {salesLeads.map(lead => (
              <div key={lead._id} style={leadCard}>
                <div style={{ flexGrow: 1 }}>
                  <span style={leadOrg}>{lead.schoolName.toUpperCase()}</span>
                  <div style={leadTail}>{lead.tailNumber} - {lead.tyrePosition}</div>
                  <div style={leadDetail}>P/N: {lead.partNumber} | S/N: {lead.serialNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {calculateHealth(lead.currentLandings, lead.maxDesignLife).toFixed(0)}% Health
                  </div>
                  <Link 
                    href={`https://wa.me/${lead.operatorEmail}?text=Hi, regarding ${lead.tailNumber}...`} 
                    style={contactBtn}
                  >
                    SEND QUOTE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

// --- STYLES ---
const kpiGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' };
const kpiCard = { backgroundColor: '#0b0f1a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' };
const kpiLabel = { fontSize: '0.6rem', color: '#64748b', fontWeight: '800', letterSpacing: '1px' };
const kpiValue = { fontSize: '2rem', fontWeight: '900', margin: '5px 0 0' };

const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' };
const sectionBox = { backgroundColor: '#0b0f1a', padding: '25px', borderRadius: '15px', border: '1px solid #1e293b' };
const sectionTitle = { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px', fontWeight: '900', letterSpacing: '1.5px' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };
const tableHeaderRow = { borderBottom: '2px solid #1e293b', textAlign: 'left' as const };
const th = { padding: '12px', fontSize: '0.7rem', color: '#64748b' };
const td = { padding: '12px', fontSize: '0.8rem', borderBottom: '1px solid #1e293b' };
const tableRow = { backgroundColor: 'transparent' };

const leadCard = { display: 'flex', alignItems: 'center', backgroundColor: '#161d2f', padding: '15px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' };
const leadOrg = { fontSize: '0.6rem', color: '#06b6d4', fontWeight: '900' };
const leadTail = { fontSize: '1rem', fontWeight: '800', margin: '2px 0' };
const leadDetail = { fontSize: '0.65rem', color: '#64748b' };
const contactBtn = { display: 'inline-block', marginTop: '8px', padding: '4px 10px', backgroundColor: '#ffb400', color: '#020617', textDecoration: 'none', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '900' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ffb400', fontWeight: '900', letterSpacing: '4px' };