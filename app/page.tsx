'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'fleet', 
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, health: 98 });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    async function fetchStats() {
      const query = `{
        "totalUnits": count(*[_type == "aircraft"]),
        "critical": count(*[_type == "aircraft" && (mainTyre.landingCount >= 225 || noseTyre.landingCount >= 270)])
      }`
      try {
        const data = await client.fetch(query)
        const healthCalc = data.totalUnits > 0 
          ? Math.round(((data.totalUnits - data.critical) / data.totalUnits) * 100) 
          : 100;
        setStats({ total: data.totalUnits, health: healthCalc });
      } catch (e) {
        console.error("Stats fetch error", e);
      }
    }
    fetchStats();
    return () => window.removeEventListener('resize', checkMobile);
  }, [])

  const whatsappNumber = "919600038089"; 
  const contactEmail = "sales@jedotech.com";
  const waMessage = encodeURIComponent(
    `Jedo Tech RFQ Inquiry\n---\nPart Number: \nDescription: \nAOG Status (Yes/No): \nQuantity: `
  );

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#000c17', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav style={{...navBarStyle, padding: isMobile ? '15px 20px' : '20px 60px'}}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo Logo" style={{ height: isMobile ? '35px' : '45px' }} />
        </Link>
        <div style={{ display: 'flex', gap: isMobile ? '15px' : '30px', alignItems: 'center' }}>
          <Link href="/marketplace" style={navLinkItem}>MARKETPLACE</Link>
          <Link href="https://jedo-fleet-intel.vercel.app" target="_blank" style={intelTabStyle}>FLEET INTEL ↗</Link>
          {!isMobile && <Link href="/marketplace#rfq-section" style={navLinkItem}>REQUEST SOURCING</Link>}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header style={heroSectionStyle}>
        <div style={heroOverlayStyle}>
          <h1 style={{ ...heroTitleStyle, fontSize: isMobile ? '2.5rem' : '3.5rem' }}>
            AVIATION <span style={{ color: '#ffb400' }}>LOGISTICS</span> COMMAND
          </h1>
          <p style={heroSubTitleStyle}>
            Specialized MRO Sourcing for Training Aircraft & Commercial Fleets. 
            Direct from Chennai Hub to Global Hangars.
          </p>
          <div style={heroBtnGroup}>
            <Link href="/marketplace" style={primaryBtnStyle}>VIEW LIVE INVENTORY</Link>
            <Link href="/marketplace#rfq-section" style={secondaryBtnStyle}>REQUEST SOURCING</Link>
          </div>
        </div>
      </header>

      {/* 3. INTELLIGENCE PULSE BAR */}
      <div style={{...pulseBarContainer, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '40px'}}>
        <div style={pulseItem}>
          <span style={pulseDot}></span>
          <span style={pulseLabel}>HUB STATUS:</span>
          <span style={pulseValue}>CHENNAI ACTIVE</span>
        </div>
        {!isMobile && <div style={pulseDivider}></div>}
        <div style={pulseItem}>
          <span style={pulseLabel}>ACTIVE FLEET:</span>
          <span style={pulseValue}>{stats.total} AIRCRAFT</span>
        </div>
        {!isMobile && <div style={pulseDivider}></div>}
        <div style={pulseItem}>
          <span style={pulseLabel}>FLEET SAFETY:</span>
          <span style={pulseValue}>{stats.health}% OPTIMAL</span>
        </div>
      </div>

      {/* 4. CORE SERVICES / CARDS */}
      <section style={serviceSectionStyle}>
        <div style={gridStyle}>
          {/* Tyres Card */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>AIRCRAFT TYRES</h3>
            <p style={cardText}>Main & Nose gear assemblies for C172, C152, and P28. Factory new and overhauled options available.</p>
            <Link href="/marketplace" style={cardLink}>BROWSE TYRES →</Link>
          </div>

          {/* Sourcing Card */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>GLOBAL SOURCING</h3>
            <p style={cardText}>Can't find a part? Our global network tracks down hard-to-find components with full certification.</p>
            <Link href="/marketplace#rfq-section" style={cardLink}>START REQUEST →</Link>
          </div>

          {/* AOG Card */}
          <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ ...cardTitle, color: '#ef4444' }}>AOG SUPPORT</h3>
            <p style={cardText}>24/7 Emergency dispatch for grounded aircraft. Rapid response for critical components from Chennai.</p>
            <Link href="/marketplace#rfq-section" style={{ ...cardLink, color: '#ef4444' }}>EMERGENCY RFQ →</Link>
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${waMessage}`} 
        target="_blank" 
        rel="noopener noreferrer"
        style={whatsappFloatingStyle}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '24px', height: '24px' }} />
        <span style={{ marginLeft: '10px', fontWeight: '700', fontSize: '0.85rem' }}>SEND RFQ / AOG</span>
      </a>

      {/* 5. FOOTER */}
      <footer style={footerStyle}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | DGCA & International Standards Compliance</p>
      </footer>
    </div>
  )
}

// --- STYLES ---
const navBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#001a35', borderBottom: '1px solid rgba(255, 180, 0, 0.2)', position: 'sticky' as const, top: 0, zIndex: 1000 } as const;
const navLinkItem = { color: '#ffb400', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' } as const;
const intelTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, border: '1px solid #ffb400', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' } as const;
const heroSectionStyle = { height: '75vh', backgroundImage: 'linear-gradient(rgba(0,12,23,0.6), rgba(0,12,23,0.6)), url("/hero-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' as const } as const;
const heroOverlayStyle = { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'center', textAlign: 'center' as const, padding: '0 20px' } as const;
const heroTitleStyle = { fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' } as const;
const heroSubTitleStyle = { fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', marginBottom: '40px', lineHeight: '1.6' } as const;
const heroBtnGroup = { display: 'flex', gap: '20px', flexWrap: 'wrap' as const, justifyContent: 'center' } as const;
const primaryBtnStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '16px 35px', borderRadius: '4px', fontWeight: '900', textDecoration: 'none', fontSize: '0.9rem' } as const;
const secondaryBtnStyle = { border: '2px solid #ffb400', color: '#ffb400', padding: '14px 35px', borderRadius: '4px', fontWeight: '900', textDecoration: 'none', fontSize: '0.9rem' } as const;
const pulseBarContainer = { backgroundColor: '#001a35', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)' } as const;
const pulseItem = { display: 'flex', alignItems: 'center', gap: '10px' } as const;
const pulseDot = { height: '8px', width: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' } as const;
const pulseLabel = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' } as const;
const pulseValue = { fontSize: '0.9rem', fontWeight: 'bold' } as const;
const pulseDivider = { height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' } as const;
const serviceSectionStyle = { padding: '80px 20px', backgroundColor: '#f1f5f9' } as const;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' } as const;
const cardStyle = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' as const, gap: '15px' } as const;
const cardTitle = { color: '#001a35', fontSize: '1.25rem', fontWeight: '800', margin: 0 } as const;
const cardText = { color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' } as const;
const cardLink = { color: '#ffb400', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem', marginTop: 'auto' } as const;
const footerStyle = { padding: '40px', textAlign: 'center' as const, backgroundColor: '#000c17', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' } as const;
const whatsappFloatingStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '12px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', textDecoration: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 10000 } as const;