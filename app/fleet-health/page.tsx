'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// 1. UPDATED INTERFACE (Including ROI and Predictive Fields)
interface FleetAsset {
  _id: string;
  aircraftType: string;
  partNumber: string;
  manufacturer?: string; // Brand (e.g. Goodyear)
  modelName?: string;    // Specific Tier (e.g. Flight Leader)
  totalLandings: number;
  maxDesignLife: number;
  purchasePrice?: number; // For CPL calculation
  dailyUtilization?: number; // Avg landings per day
  ownerEmail: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false to ensure fresh "Intelligence" data
})

export default function FleetHealth() {
  const [assets, setAssets] = useState<FleetAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function fetchFleet() {
      try {
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

  // --- INTELLIGENCE CALCULATIONS ---
  
  const calculateCPL = (price: number | undefined, landings: number) => {
    if (!price || landings === 0) return "N/A";
    return `₹${(price / landings).toFixed(2)}`;
  }

  const calculateDaysRemaining = (current: number, max: number, daily: number | undefined) => {
    if (!daily || daily === 0) return "Set Daily Avg";
    const remaining = max - current;
    const days = Math.floor(remaining / daily);
    return days <= 0 ? "GROUNDED" : `${days} Days`;
  }

  const calculateHealth = (current: number, max: number) => {
    const totalMax = max || 350;
    const percentage = ((totalMax - current) / totalMax) * 100;
    return Math.max(0, Math.min(100, percentage)).toFixed(1);
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={pulseDot}></div>
          <p style={{ color: '#ffb400', fontWeight: 'bold', letterSpacing: '3px', marginTop: '20px' }}>ANALYZING FLEET ROI...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/"><img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} /></Link>
          <div style={{ display: 'flex', gap: '25px' }}>
            <Link href="/" style={navLinkStyle}>DASHBOARD</Link>
            <Link href="/marketplace" style={navLinkStyle}>PROCUREMENT</Link>
          </div>
        </div>
        <div style={statusBadge}>JEDO INTELLIGENCE ENGINE v1.0</div>
      </nav>

      {/* HEADER */}
      <header style={{ padding: '60px 40px 30px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#001a35', fontWeight: '900', fontSize: '2.2rem', margin: 0 }}>
          FLEET <span style={{ color: '#ffb400' }}>INTELLIGENCE</span>
        </h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div style={summaryTag}>TOTAL ASSETS: {assets.length}</div>
          <div style={summaryTag}>LOCATION: CHENNAI HUB</div>
        </div>
      </header>

      {/* ASSET GRID */}
      <main style={{ padding: '0 40px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={gridStyle}>
          {assets.length > 0 ? assets.map((asset) => {
            const healthPercent = parseFloat(calculateHealth(asset.totalLandings, asset.maxDesignLife))
            const daysLeft = calculateDaysRemaining(asset.totalLandings, asset.maxDesignLife, asset.dailyUtilization)
            const cpl = calculateCPL(asset.purchasePrice, asset.totalLandings)
            
            // Traffic Light Logic
            const statusColor = healthPercent < 20 ? '#ef4444' : healthPercent < 45 ? '#f59e0b' : '#10b981';

            return (
              <div key={asset._id} style={cardStyle}>
                {/* 1. TOP HEADER: TAIL & HEALTH */}
                <div style={cardHeader}>
                  <div>
                    <span style={typeBadge}>{asset.aircraftType}</span>
                    <h3 style={tailTitle}>{asset.manufacturer} {asset.modelName || 'Tyre'}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...healthBadge, color: statusColor, borderColor: statusColor }}>
                      {healthPercent}% LIFE
                    </div>
                  </div>
                </div>

                {/* 2. PREDICTIVE COUNTDOWN SECTION */}
                <div style={{ ...countdownBox, backgroundColor: healthPercent < 20 ? '#fef2f2' : '#f8fafc' }}>
                   <span style={label}>ESTIMATED GROUNDING IN</span>
                   <span style={{ ...countdownValue, color: statusColor }}>{daysLeft}</span>
                </div>

                {/* 3. COST & USAGE METRICS */}
                <div style={intelGrid}>
                  <div style={intelBox}>
                    <span style={label}>COST PER LANDING</span>
                    <span style={intelValue}>{cpl}</span>
                  </div>
                  <div style={intelBox}>
                    <span style={label}>LANDINGS DONE</span>
                    <span style={intelValue}>{asset.totalLandings}</span>
                  </div>
                </div>

                {/* 4. PROGRESS BAR */}
                <div style={progressWrapper}>
                  <div style={{ ...progressFill, width: `${healthPercent}%`, backgroundColor: statusColor }}></div>
                </div>

                {/* 5. FOOTER ACTIONS */}
                <div style={cardFooter}>
                  <div style={ownerSection}>
                    <span style={label}>OPERATOR</span>
                    <span style={ownerEmail}>{asset.ownerEmail || 'Unknown'}</span>
                  </div>
                  {healthPercent < 45 && (
                    <Link href={`https://wa.me/919600038089?text=Jedo%20Intelligence%20Alert:%20Asset%20${asset.aircraftType}%20is%20at%20${healthPercent}%%20life.%20Need%20quote%20for%20${asset.partNumber}`} style={orderBtn}>
                      ORDER REPLACEMENT
                    </Link>
                  )}
                </div>
              </div>
            )
          }) : (
            <div style={emptyState}>
               <img src="/jedo-logo.png" style={{ opacity: 0.2, height: '40px', marginBottom: '20px' }} />
               <h3>No Active Intelligence Data</h3>
               <p>Add purchase price and daily utilization in Sanity to enable CPL tracking.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// --- WORLD CLASS STYLING ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#001a35', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold' as const, letterSpacing: '1px' };
const statusBadge = { color: '#ffb400', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #ffb400', padding: '4px 10px', borderRadius: '4px' };

const summaryTag = { backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' as const, color: '#64748b', border: '1px solid #e2e8f0' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6', position: 'relative' as const };

const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
const typeBadge = { fontSize: '0.65rem', fontWeight: '900' as const, color: '#ffb400', letterSpacing: '1px' };
const tailTitle = { margin: '5px 0 0 0', fontSize: '1.2rem', color: '#001a35', fontWeight: '800' as const };
const healthBadge = { padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '900' as const, border: '2px solid' };

const countdownBox = { padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', marginBottom: '20px' };
const countdownValue = { fontSize: '1.4rem', fontWeight: '900' as const, marginTop: '5px' };

const intelGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' };
const intelBox = { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' as const };
const intelValue = { display: 'block', fontSize: '1rem', fontWeight: '800' as const, color: '#001a35', marginTop: '4px' };

const progressWrapper = { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' as const, marginBottom: '25px' };
const progressFill = { height: '100%', transition: 'width 1s ease' };

const cardFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' };
const ownerSection = { display: 'flex', flexDirection: 'column' as const };
const ownerEmail = { fontSize: '0.75rem', fontWeight: '600' as const, color: '#001a35' };
const orderBtn = { backgroundColor: '#ffb400', color: '#001a35', textDecoration: 'none', padding: '10px 15px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900' as const };

const label = { fontSize: '0.6rem', fontWeight: '900' as const, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' as const };

const loaderStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001a35' };
const pulseDot = { width: '20px', height: '20px', backgroundColor: '#ffb400', borderRadius: '50%', animation: 'pulse 1.5s infinite' };

const emptyState = { gridColumn: '1 / -1', padding: '100px', textAlign: 'center' as const, backgroundColor: 'white', borderRadius: '30px', border: '2px dashed #e2e8f0', color: '#94a3b8' };