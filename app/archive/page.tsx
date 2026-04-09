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
  const [exchangeRate, setExchangeRate] = useState(84.00)

  useEffect(() => {
    const storedOrg = localStorage.getItem('fleet_user_org')
    async function fetchArchive() {
      try {
        // Fetch Live Exchange Rate for consistent CPL reporting
        const rateRes = await fetch(`https://v6.exchangerate-api.com/v6/cf89f7b96ff3c0675edcfe39/pair/USD/INR`)
        const rateData = await rateRes.json()
        if (rateData.conversion_rate) {
          setExchangeRate(rateData.conversion_rate)
        }

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

  if (loading) return <div style={loaderStyle}>OPENING SECURE ARCHIVE...</div>

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={headingStyle}>HISTORICAL <span style={{ color: '#06b6d4' }}>ASSET ARCHIVE</span></h1>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '5px', letterSpacing: '1px' }}>CERTIFIED RECORD OF DECOMMISSIONED COMPONENTS</p>
        </div>
        
        <Link href="/fleet-health" style={backButtonStyle}>
          RETURN TO LIVE COMMAND
        </Link>
      </header>

      <div style={tableWrapper}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #1e293b' }}>
              <th style={thStyle}>AIRCRAFT</th>
              <th style={thStyle}>BRAND / MODEL</th>
              <th style={thStyle}>PART NUMBER (P/N)</th>
              <th style={thStyle}>SERIAL NUMBER (S/N)</th>
              <th style={thStyle}>FINAL / DESIGN LIFE</th>
              <th style={thStyle}>FINAL CPL</th>
              <th style={thStyle}>REMOVAL REASON</th>
            </tr>
          </thead>
          <tbody>
            {retiredAssets.length > 0 ? (
              retiredAssets.map(asset => {
                // ARCHITECT'S MATH: Calculate Final CPL for the record
                const priceINR = (asset.purchasePrice || 0) * exchangeRate;
                const finalCpl = (priceINR > 0 && asset.currentLandings > 0) 
                  ? (priceINR / asset.currentLandings).toFixed(2) 
                  : '0.00';

                return (
                  <tr key={asset._id} style={trStyle}>
                    <td style={tdStyle}><span style={tailBadge}>{asset.tailNumber}</span></td>
                    <td style={tdStyle}>{asset.manufacturer} <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{asset.tyreModel}</span></td>
                    <td style={tdStyle}><code style={codeStyle}>{asset.partNumber || 'N/A'}</code></td>
                    <td style={tdStyle}><code style={codeStyle}>{asset.serialNumber}</code></td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '700' }}>
                          {asset.currentLandings || 0} / {asset.maxDesignLife || 300}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#06b6d4', fontWeight: '700' }}>₹{finalCpl}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={reasonBadge(asset.removalReason)}>
                        {asset.removalReason?.toUpperCase() || 'NORMAL WEAR'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: '#475569' }}>NO ARCHIVED RECORDS FOUND FOR THIS ORGANIZATION</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- ARCHITECTURAL STYLES ---

const headingStyle = { 
  fontSize: '1.8rem', 
  fontWeight: '900', 
  margin: 0, 
  letterSpacing: '-0.5px' 
};

const backButtonStyle = { 
  backgroundColor: 'rgba(255, 180, 0, 0.05)',
  color: '#ffb400',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.65rem',
  fontWeight: '800',
  border: '1px solid #ffb400',
  transition: 'all 0.2s ease',
  letterSpacing: '1px'
};

const tableWrapper = {
  backgroundColor: '#0b0f1a',
  borderRadius: '16px',
  border: '1px solid #1e293b',
  overflow: 'hidden',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
};

const thStyle = { 
  padding: '20px', 
  color: '#64748b', 
  textAlign: 'left' as const, 
  fontSize: '0.65rem', 
  fontWeight: '900', 
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const
};

const trStyle = { 
  borderBottom: '1px solid #1e293b',
  transition: 'background 0.2s ease',
};

const tdStyle = { 
  padding: '18px 20px', 
  fontSize: '0.85rem' 
};

const tailBadge = {
  backgroundColor: '#1e293b',
  padding: '4px 8px',
  borderRadius: '4px',
  color: '#ffb400',
  fontWeight: '900',
  fontSize: '0.75rem'
};

const codeStyle = {
  fontFamily: 'monospace',
  color: '#06b6d4',
  fontSize: '0.8rem',
  backgroundColor: 'rgba(6, 182, 212, 0.05)',
  padding: '2px 6px',
  borderRadius: '4px'
};

const reasonBadge = (reason: string) => ({
  fontSize: '0.6rem',
  fontWeight: '800',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: reason === 'FOD' || reason === 'Flat Spot' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
  color: reason === 'FOD' || reason === 'Flat Spot' ? '#ef4444' : '#94a3b8',
  border: reason === 'FOD' || reason === 'Flat Spot' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(100, 116, 139, 0.2)'
});

const loaderStyle = { 
  display: 'flex', 
  height: '100vh', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundColor: '#020617', 
  color: '#06b6d4', 
  fontWeight: '900',
  letterSpacing: '3px'
};