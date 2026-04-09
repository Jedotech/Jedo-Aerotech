'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production', 
  apiVersion: '2023-05-03', 
  useCdn: false, 
})

export default function AssetArchive() {
  const [retiredAssets, setRetiredAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedOrg = localStorage.getItem('fleet_user_org')
    async function fetchArchive() {
      try {
        const data = await client.fetch(
          `*[_type == "fleetRecord" && schoolName->organization == $org && status == "retired"] | order(_updatedAt desc)`,
          { org: storedOrg }
        )
        setRetiredAssets(data || [])
      } catch (e) {
        console.error("Archive Fetch Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchArchive()
  }, [])

  if (loading) return <div style={loaderStyle}>INITIALIZING SECURE DATA VAULT...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px 60px', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
        <div>
          <h1 style={headingStyle}>
            CERTIFIED RECORD OF <span style={{ color: '#06b6d4', display: 'block' }}>DECOMMISSIONED COMPONENTS</span>
          </h1>
          <div style={horizontalRule}></div>
          <p style={subTitleStyle}>JEDO TECH VERIFIED COMPLIANCE ARCHIVE</p>
        </div>
        
        <Link href="/fleet-health" style={backButtonStyle}>
          <span style={{ fontSize: '1rem' }}>←</span> RETURN TO LIVE COMMAND
        </Link>
      </header>

      <div style={tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th style={thStyle}>AIRCRAFT TAIL</th>
              <th style={thStyle}>COMPONENT SPECIFICATION</th>
              <th style={thStyle}>PART NUMBER (P/N)</th>
              <th style={thStyle}>SERIAL NUMBER (S/N)</th>
              <th style={thStyle}>SERVICE LIFE (LNDG)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>DECOMMISSION REASON</th>
            </tr>
          </thead>
          <tbody>
            {retiredAssets.length > 0 ? (
              retiredAssets.map(asset => (
                <tr key={asset._id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={tailBadge}>{asset.tailNumber}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '700', color: '#f8fafc' }}>{asset.manufacturer}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{asset.tyreModel}</div>
                  </td>
                  <td style={tdStyle}>
                    <code style={codeStyle}>{asset.partNumber || 'N/A'}</code>
                  </td>
                  <td style={tdStyle}>
                    <code style={codeStyle}>{asset.serialNumber}</code>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: '900', fontSize: '1rem', color: '#cbd5e1' }}>{asset.currentLandings}</span>
                    <span style={{ fontSize: '0.6rem', color: '#475569', marginLeft: '4px' }}>/ {asset.maxDesignLife}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <span style={reasonBadge(asset.removalReason)}>
                      {asset.removalReason?.toUpperCase() || 'NORMAL WEAR'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '100px', textAlign: 'center', color: '#475569', fontSize: '0.8rem', letterSpacing: '2px' }}>
                  NO DECOMMISSIONED ASSETS FOUND IN CURRENT REGISTRY
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <footer style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '20px', opacity: 0.4 }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>SYSTEM ID: JEDO-ARCHIVE-PRIME | {new Date().getFullYear()} © JEDO TECHNOLOGIES PVT. LTD.</p>
      </footer>
    </div>
  )
}

// --- ARCHITECTURAL STYLES ---

const headingStyle: any = { 
  fontSize: '1.4rem', 
  fontWeight: '900', 
  margin: 0, 
  lineHeight: '1.3',
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const horizontalRule = {
  height: '3px',
  width: '40px',
  backgroundColor: '#ffb400',
  margin: '15px 0'
};

const subTitleStyle = { 
  color: '#64748b', 
  fontSize: '0.65rem', 
  fontWeight: '800',
  letterSpacing: '3px'
};

const backButtonStyle: any = { 
  backgroundColor: 'transparent',
  color: '#ffb400', // GOLDEN BRAND COLOR
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: '900',
  border: '2px solid #ffb400',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  letterSpacing: '1px'
};

const tableWrapper = {
  marginTop: '20px'
};

const thStyle: any = { 
  padding: '10px 20px', 
  color: '#475569', 
  textAlign: 'left', 
  fontSize: '0.6rem', 
  fontWeight: '900', 
  letterSpacing: '2px',
  textTransform: 'uppercase'
};

const trStyle: any = { 
  backgroundColor: 'rgba(30, 41, 59, 0.3)',
  transition: 'transform 0.2s ease, background 0.2s ease',
  cursor: 'default'
};

const tdStyle: any = { 
  padding: '16px 20px', 
  fontSize: '0.8rem',
  borderTop: '1px solid rgba(255,255,255,0.02)',
  borderBottom: '1px solid rgba(255,255,255,0.02)'
};

const tailBadge = {
  backgroundColor: '#ffb400',
  padding: '6px 10px',
  borderRadius: '3px',
  color: '#020617',
  fontWeight: '900',
  fontSize: '0.7rem',
  display: 'inline-block'
};

const codeStyle = {
  fontFamily: 'monospace',
  color: '#06b6d4',
  fontSize: '0.85rem',
  letterSpacing: '0.5px'
};

const reasonBadge = (reason: string): any => ({
  fontSize: '0.55rem',
  fontWeight: '900',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: reason === 'FOD' || reason === 'Flat Spot' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.1)',
  color: reason === 'FOD' || reason === 'Flat Spot' ? '#ef4444' : '#10b981',
  border: `1px solid ${reason === 'FOD' || reason === 'Flat Spot' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
  display: 'inline-block'
});

const loaderStyle: any = { 
  display: 'flex', 
  height: '100vh', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundColor: '#020617', 
  color: '#ffb400', 
  fontWeight: '900',
  letterSpacing: '5px',
  fontSize: '0.8rem',
  textTransform: 'uppercase'
};