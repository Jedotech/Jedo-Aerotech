'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. DATA INTERFACE (Aligned with src/sanity/schemaTypes/fleet.ts)
interface FleetAsset {
  _id: string;
  aircraftType: string;
  partNumber: string;
  totalLandings: number;
  maxDesignLife: number;
  ownerEmail: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production', // Pointing to the merged production dataset
  apiVersion: '2023-05-03',
  useCdn: true, // Staying within Sanity free tier API quotas
})

export default function FleetHealth() {
  const [assets, setAssets] = useState<FleetAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function fetchFleet() {
      try {
        // Querying for 'fleet' type documents now in the production bucket
        const data = await client.fetch(`*[_type == "fleet"] | order(aircraftType asc)`)
        setAssets(data || [])
      } catch (e) {
        console.error("Fleet Sync Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchFleet()
  }, [])

  const calculateHealth = (current: number, max: number) => {
    const totalMax = max || 350; // Fallback to schema initialValue
    const remaining = totalMax - current
    const percentage = (remaining / totalMax) * 100
    return Math.max(0, Math.min(100, percentage)).toFixed(1)
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffb400', fontWeight: 'bold', letterSpacing: '3px' }}>INITIALIZING FLEET INTELLIGENCE...</p>
          <p style={{ fontSize: '0.8rem', color: '#ffffff', opacity: 0.6 }}>Synchronizing Lifecycle Data</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <div style={{ display: 'flex', gap: '25px' }}>
            <Link href="/" style={navLinkStyle}>HOME</Link>
            <Link href="/marketplace" style={navLinkStyle}>MARKETPLACE</Link>
          </div>
        </div>
        <div style={statusBadge}>NETWORK STATUS: PRODUCTION DATASET</div>
      </nav>

      {/* HEADER */}
      <header style={{ padding: '100px 40px 40px', maxWidth: '1440px', margin: '0 auto' }}>
        <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2.5rem', margin: 0 }}>
          FLEET <span style={{ color: '#ffb400' }}>HEALTH</span> MONITOR
        </h1>
        <p style={{ color: '#94a3b8', fontWeight: '600', marginTop: '10px', fontSize: '0.9rem' }}>
          Predictive Maintenance & Component Lifecycle Intelligence
        </p>
      </header>

      {/* ASSET GRID */}
      <main style={{ padding: '0 40px 80px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={gridStyle}>
          {assets.length > 0 ? assets.map((asset) => {
            const health = parseFloat(calculateHealth(asset.totalLandings, asset.maxDesignLife))
            const isCritical = health < 20
            const isWarning = health >= 20 && health < 45

            return (
              <div key={asset._id} style={cardStyle}>
                <div style={cardHeader}>
                  <span style={typeBadge}>{asset.aircraftType || 'Unassigned Model'}</span>
                  <span style={{ ...healthText, color: isCritical ? '#ef4444' : isWarning ? '#ffb400' : '#10b981' }}>
                    {health}% REMAINING
                  </span>
                </div>

                <div style={dataRow}>
                  <span style={label}>PART NUMBER</span>
                  <span style={value}>{asset.partNumber || 'N/A'}</span>
                </div>

                <div style={progressContainer}>
                  <div style={{ 
                    ...progressFill, 
                    width: `${health}%`, 
                    backgroundColor: isCritical ? '#ef4444' : isWarning ? '#ffb400' : '#10b981' 
                  }}></div>
                </div>

                <div style={statsRow}>
                  <div>
                    <div style={statLabel}>LANDINGS</div>
                    <div style={statValue}>{asset.totalLandings}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={statLabel}>DESIGN LIFE</div>
                    <div style={statValue}>{asset.maxDesignLife}</div>
                  </div>
                </div>

                <div style={cardFooter}>
                  <span style={ownerInfo}>{asset.ownerEmail || 'No Operator Assigned'}</span>
                  <Link href={`mailto:${asset.ownerEmail}`} style={actionBtn}>
                    CONTACT OPS
                  </Link>
                </div>
              </div>
            )
          }) : (
            <div style={emptyState}>
              <p>No fleet assets detected in the production dataset.</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: '10px' }}>Verify documents are "Published" in Sanity Studio.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// --- PROFESSIONAL STYLING ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#001a35', boxSizing: 'border-box' as const };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' as const, letterSpacing: '1px' };
const statusBadge = { color: '#ffb400', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px', border: '1px solid #ffb400', padding: '4px 12px', borderRadius: '4px' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const typeBadge = { backgroundColor: '#001a35', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' as const };
const healthText = { fontSize: '0.85rem', fontWeight: '900' as const };

const dataRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' };
const label = { color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' as const };
const value = { color: '#001a35', fontSize: '0.8rem', fontWeight: '800' as const };

const progressContainer = { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' as const };
const progressFill = { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' };

const statsRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' };
const statLabel = { color: '#94a3b8', fontSize: '0.65rem', fontWeight: 'bold' as const, marginBottom: '4px' };
const statValue = { color: '#001a35', fontSize: '1.2rem', fontWeight: '900' as const };

const cardFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' };
const ownerInfo = { fontSize: '0.7rem', color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' };
const actionBtn = { fontSize: '0.7rem', color: '#ffb400', fontWeight: 'bold' as const, textDecoration: 'none', border: '1px solid #ffb400', padding: '4px 10px', borderRadius: '4px' };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35', color: '#ffb400' };
const emptyState = { gridColumn: '1 / -1', textAlign: 'center' as const, padding: '100px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '20px', backgroundColor: '#ffffff' };