'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

function ManifestContent() {
  const searchParams = useSearchParams()
  const [shipmentItems, setShipmentItems] = useState<any[]>([])
  const [consignee, setConsignee] = useState("AAG Centre for Aviation Training\nChennai, India")
  
  const ids = searchParams.get('ids')?.split(',') || []

  // STABLE REF NUMBER: Generated once per page load
  const shipmentRef = useMemo(() => `JEDO-SHP-${Math.floor(100000 + Math.random() * 900000)}`, []);

  // QR CODE GENERATOR: Links to your marketplace search for these parts
  const qrCodeUrl = useMemo(() => {
    const baseUrl = "https://jedo-fleet-intel.vercel.app/marketplace";
    const searchValues = shipmentItems.map(i => i.partNumber).join(',');
    // Google Chart API for instant QR generation
    return `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(baseUrl + '?search=' + searchValues)}&choe=UTF-8`;
  }, [shipmentItems]);

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
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          textarea { border: none !important; resize: none !important; padding: 0 !important; background: transparent !important; }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div style={headerFlex}>
        <div>
          <img src="/jedo-logo.png" alt="Jedo Logo" style={{ height: '50px' }} />
          <h2 style={{ margin: '10px 0 0', color: '#001a35' }}>HANGAR RELEASE NOTE</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Ref: {shipmentRef}</p>
        </div>
        <div style={consigneeBox}>
          <p style={label}>CONSIGNEE:</p>
          <textarea 
            value={consignee}
            onChange={(e) => setConsignee(e.target.value)}
            style={consigneeInput}
            rows={3}
          />
        </div>
      </div>

      <hr style={{ border: '1px solid #e2e8f0', margin: '30px 0' }} />

      {/* TECHNICAL TABLE */}
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

      {/* SHIPMENT ADVISORY */}
      <div style={aiBriefBox}>
        <p style={{ ...label, color: '#ffb400' }}>JEDO INTEL: SHIPMENT ADVISORY</p>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#1e293b' }}>
          "Verified {shipmentItems.length} technical assets for dispatch. Inflation pressures must match aircraft POH specs for high-cycle training environments. Maintain traceability records in accordance with DGCA/FAA standards."
        </p>
      </div>

      {/* FOOTER: Signature and QR Code */}
      <div style={footerFlex}>
        <div style={signatureBox}>
          <p style={label}>RELEASED BY (JEDO TECH):</p>
          <div style={{ borderBottom: '1px solid #000', height: '40px', width: '250px', marginBottom: '10px' }}></div>
          <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Authorized Signature & Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={qrBox}>
          <p style={label}>DIGITAL TRACE:</p>
          {shipmentItems.length > 0 && (
            <img src={qrCodeUrl} alt="QR Code" style={{ width: '100px', height: '100px', border: '1px solid #f1f5f9' }} />
          )}
          <p style={{ fontSize: '0.5rem', color: '#94a3b8', marginTop: '4px' }}>SCAN FOR LIVE SPECS</p>
        </div>
      </div>

      <button onClick={() => window.print()} className="no-print" style={printBtn}>
        PRINT MANIFEST
      </button>
    </div>
  )
}

export default function ManifestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Manifest Data...</div>}>
      <ManifestContent />
    </Suspense>
  )
}

// --- STYLES ---
const manifestPageStyle = { padding: '60px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' } as const;
const headerFlex = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as const;
const consigneeBox = { textAlign: 'right' as const, width: '300px' } as const;
const consigneeInput = { width: '100%', padding: '10px', fontSize: '0.9rem', border: '1px dashed #cbd5e1', borderRadius: '4px', fontFamily: 'inherit', textAlign: 'right' as any, backgroundColor: '#fcfcfc' } as const;
const label = { fontSize: '0.65rem', fontWeight: '900', color: '#64748b', margin: '0 0 5px', letterSpacing: '0.5px' } as const;
const manifestTable = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '30px' } as const;
const th = { padding: '12px', textAlign: 'left' as const, fontSize: '0.75rem', color: '#64748b', borderBottom: '2px solid #001a35' } as const;
const td = { padding: '12px', fontSize: '0.85rem' } as const;
const aiBriefBox = { marginTop: '40px', padding: '20px', backgroundColor: '#fdfaf2', borderLeft: '4px solid #ffb400', borderRadius: '4px' } as const;
const footerFlex = { marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } as const;
const signatureBox = { textAlign: 'left' as const } as const;
const qrBox = { textAlign: 'center' as const } as const;
const printBtn = { marginTop: '50px', backgroundColor: '#001a35', color: '#fff', padding: '12px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' } as const;