'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

const client = createClient({
  projectId: 'm2pa474h', dataset: 'production', apiVersion: '2023-05-03', useCdn: false, 
})

export default function AssetArchive() {
  const [retiredAssets, setRetiredAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedOrg = localStorage.getItem('fleet_user_org')
    async function fetchArchive() {
      const data = await client.fetch(
        `*[_type == "fleetRecord" && schoolName->organization == $org && status == "retired"] | order(_updatedAt desc)`,
        { org: storedOrg }
      )
      setRetiredAssets(data || [])
      setLoading(false)
    }
    fetchArchive()
  }, [])

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontWeight: '900' }}>HISTORICAL ASSET ARCHIVE</h1>
        <Link href="/fleet-health" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 'bold' }}>← BACK TO LIVE FLEET</Link>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0b0f1a', borderRadius: '12px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#1e293b', textAlign: 'left', fontSize: '0.7rem' }}>
          <tr>
            <th style={thStyle}>TAIL #</th>
            <th style={thStyle}>BRAND/MODEL</th>
            <th style={thStyle}>SERIAL #</th>
            <th style={thStyle}>FINAL LANDINGS</th>
            <th style={thStyle}>REMOVAL REASON</th>
          </tr>
        </thead>
        <tbody>
          {retiredAssets.map(asset => (
            <tr key={asset._id} style={{ borderBottom: '1px solid #1e293b', fontSize: '0.8rem' }}>
              <td style={tdStyle}>{asset.tailNumber}</td>
              <td style={tdStyle}>{asset.manufacturer} {asset.tyreModel}</td>
              <td style={tdStyle}>{asset.serialNumber}</td>
              <td style={tdStyle}>{asset.currentLandings}</td>
              <td style={tdStyle}><span style={{ color: '#ef4444' }}>{asset.removalReason || 'Not Specified'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = { padding: '15px', color: '#94a3b8' };
const tdStyle = { padding: '15px' };