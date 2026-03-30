'use client'

import { useEffect, useState, Suspense } from 'react' // 1. Added Suspense
import { useSearchParams } from 'next/navigation'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

// 2. Move your main logic into a sub-component
function ManifestContent() {
  const searchParams = useSearchParams()
  const [shipmentItems, setShipmentItems] = useState<any[]>([])
  const ids = searchParams.get('ids')?.split(',') || []

  useEffect(() => {
    async function fetchSelected() {
      const query = `*[_id in $ids]{
        partNumber,
        description,
        condition,
        location,
        "ply": plyRating
      }`
      const data = await client.fetch(query, { ids })
      setShipmentItems(data)
    }
    if (ids.length > 0) fetchSelected()
  }, [ids])

  return (
    <div style={manifestPageStyle}>
      <div style={headerFlex}>
        <div>
          <img src="/jedo-logo.png" alt="Jedo Logo" style={{ height: '50px' }} />
          <h2 style={{ margin: '10px 0 0', color: '#001a35' }}>HANGAR RELEASE NOTE</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Ref: JEDO-SHP-{new Date().getTime().toString().slice(-6)}</p>
        </div>
        <div style={consigneeBox}>
          <p style={label}>CONSIGNEE:</p>
          <p style={dataText}><b>AAG Centre for Aviation Training</b></p>
          <p style={dataText}>Chennai, India</p>
        </div>
      </div>

      <hr style={{ border: '1px solid #e2e8f0', margin: '30px 0' }} />

      <table style={manifestTable}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={th}>PART NUMBER</th>
            <th style={th}>DESCRIPTION</th>
            <th style={th}>PLY</th>
            <th style={th}>CONDITION</th>
            <th style={th}>DOCS ATTACHED</th>
          </tr>
        </thead>
        <tbody>
          {shipmentItems.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={td}><b>{item.partNumber}</b></td>
              <td style={td}>{item.description}</td>
              <td style={td}>{item.ply || 'N/A'}</td>
              <td style={td}>{item.condition}</td>
              <td style={td}>[ ] 8130-3 / Form 1</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={aiBriefBox}>
        <p style={{ ...label, color: '#ffb400' }}>GEMINI AI SAFETY BRIEF:</p>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#1e293b' }}>
          "Verified {shipmentItems.length} assets for dispatch. Inflation pressures must match aircraft POH specs for high-cycle training."
        </p>
      </div>

      <div style={footerFlex}>
        <div style={signatureBox}>
          <p style={label}>RELEASED BY (JEDO TECH):</p>
          <div style={{ borderBottom: '1px solid #000', height: '40px', width: '200px' }}></div>
        </div>
      </div>

      <button onClick={() => window.print()} style={printBtn}>PRINT MANIFEST</button>
    </div>
  )
}

// 3. The main export now wraps everything in Suspense
export default function ManifestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Manifest Data...</div>}>
      <ManifestContent />
    </Suspense>
  )
}

// --- KEEP ALL YOUR STYLES BELOW AS THEY WERE ---
const manifestPageStyle = { padding: '60px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' } as const;
const headerFlex = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as const;
const consigneeBox = { textAlign: 'right' as const, border: '1px solid #e2e8f0', padding: '15px', borderRadius: '4px' } as const;
const label = { fontSize: '0.65rem', fontWeight: '900', color: '#64748b', margin: '0 0 5px' } as const;
const dataText = { fontSize: '0.9rem', margin: 0 } as const;
const manifestTable = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '30px' } as const;
const th = { padding: '12px', textAlign: 'left' as const, fontSize: '0.75rem', color: '#64748b', borderBottom: '2px solid #001a35' } as const;
const td = { padding: '12px', fontSize: '0.85rem' } as const;
const aiBriefBox = { marginTop: '40px', padding: '20px', backgroundColor: '#fffbeb', borderLeft: '4px solid #ffb400', borderRadius: '4px' } as const;
const footerFlex = { marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } as const;
const signatureBox = { textAlign: 'left' as const } as const;
const printBtn = { marginTop: '50px', backgroundColor: '#001a35', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'block' } as const;