'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, health: 98 });

  useEffect(() => {
    async function fetchStats() {
      const query = `{
        "total": count(*[_type == "part"]),
        "critical": count(*[_type == "part" && totalLandings >= 300])
      }`
      try {
        const data = await client.fetch(query)
        // Simple health logic: (Total - Critical) / Total
        const healthCalc = data.total > 0 
          ? Math.round(((data.total - data.critical) / data.total) * 100) 
          : 100;
        setStats({ total: data.total, health: healthCalc });
      } catch (e) {
        console.error("Stats fetch error", e);
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto' }} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/marketplace" style={navLinkStyle}>MARKETPLACE</Link>
          <Link 
            href="https://jedo-fleet-intel.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={intelTabStyle}
          >
            FLEET INTELLIGENCE ↗
          </Link>
          <Link href="/marketplace#rfq" style={quoteButtonStyle}>REQUEST SOURCING</Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', maxWidth: '850px', margin: '0 auto 40px', opacity: 0.95 }}>
            Specialized brokerage for Cessna & Piper. We source, verify, and deliver certified aviation tyres to your hangar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/marketplace" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="https://jedo-fleet-intel.vercel.app" target="_blank" style={secondaryButtonStyle}>Fleet Intel Login</Link>
          </div>
        </div>
      </section>

      {/* 3. INTELLIGENCE PULSE BAR (NEW) */}
      <div style={pulseBarContainer}>
        <div style={pulseItem}>
          <span style={pulseDot}></span>
          <span style={pulseLabel}>CHENNAI HUB:</span>
          <span style={pulseValue}>ACTIVE</span>
        </div>
        <div style={pulseDivider}></div>
        <div style={pulseItem}>
          <span style={pulseLabel}>TRACKED ASSETS:</span>
          <span style={pulseValue}>{stats.total} UNITS</span>
        </div>
        <div style={pulseDivider}></div>
        <div style={pulseItem}>
          <span style={pulseLabel}>FLEET SAFETY:</span>
          <span style={pulseValue}>{stats.health}% OPTIMAL</span>
        </div>
      </div>

      {/* 4. LOGO BAR */}
      <div style={{ backgroundColor: '#ffffff', padding: '40px 0', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#cbd5e1', letterSpacing: '2px', marginBottom: '20px' }}>SUPPORTED AIRCRAFT PLATFORMS</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', opacity: 0.4, filter: 'grayscale(100%)' }}>
          <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#64748b' }}>CESSNA</span>
          <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#64748b' }}>PIPER</span>
          <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#64748b' }}>BEECHCRAFT</span>
          <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#64748b' }}>CIRRUS</span>
        </div>
      </div>

      {/* 5. CORE CAPABILITIES */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌐</div>
            <h3 style={featureTitleStyle}>Global Procurement</h3>
            <p style={featureTextStyle}>Direct access to MRO inventory in Singapore and USA hubs for rapid dispatch.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>⚖️</div>
            <h3 style={featureTitleStyle}>Technical Verification</h3>
            <p style={featureTextStyle}>Every tyre is sourced with full traceability and digital airworthiness documentation.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🚚</div>
            <h3 style={featureTitleStyle}>Hangar Delivery</h3>
            <p style={featureTextStyle}>Seamless customs handling and last-mile delivery to any flight school in India.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'rgba(255,255,255,0.4)', padding: '60px 20px', textAlign: 'center', fontSize: '0.85rem' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', opacity: 0.7 };
const intelTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', border: '1px solid #ffb400', padding: '8px 18px', borderRadius: '4px' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const heroSectionStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.6), rgba(0,45,91,0.6)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };

// PULSE BAR STYLES
const pulseBarContainer = { backgroundColor: '#002d5b', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const pulseItem = { display: 'flex', alignItems: 'center', gap: '10px' };
const pulseDot = { height: '8px', width: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' };
const pulseLabel = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };
const pulseValue = { fontSize: '0.9rem', fontWeight: 'bold', color: 'white' };
const pulseDivider = { height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' };

const featureCardStyle = { textAlign: 'center' as const, padding: '20px' };
const featureTitleStyle = { color: '#002d5b', fontSize: '1.4rem', fontWeight: '900', marginBottom: '15px' };
const featureTextStyle = { color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem' };