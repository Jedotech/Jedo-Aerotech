'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image' // Changed to Next.js Image for better performance
import { createClient } from 'next-sanity'

// UPDATED: Dataset changed from 'fleet' to 'production'
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production', 
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, health: 98 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0 }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav style={{...navStyle, padding: isMobile ? '15px 20px' : '20px 60px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            {/* Optimized Image Component */}
            <Image 
              src="/jedo-logo.png" 
              alt="Jedo Technologies" 
              height={45} 
              width={180} 
              style={{ height: isMobile ? '35px' : '45px', width: 'auto' }} 
            />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '12px' : '25px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/marketplace" style={navLinkStyle}>MARKETPLACE</Link>
          
          <Link href="/login" style={{...intelTabStyle, fontSize: isMobile ? '0.7rem' : '0.85rem'}}>
            FLEET INTEL ↗
          </Link>
          
          <Link href="/marketplace#rfq-section" style={{...quoteButtonStyle, padding: isMobile ? '8px 12px' : '12px 25px', fontSize: isMobile ? '0.7rem' : '0.85rem'}}>REQUEST SOURCING</Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{...heroSectionStyle, padding: isMobile ? '80px 20px' : '0'}}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 style={{ fontSize: isMobile ? '2.8rem' : '5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: isMobile ? '1.1rem' : '1.4rem', fontWeight: '500', maxWidth: '800px', margin: '0 auto 40px', color: 'rgba(255,255,255,0.9)' }}>
            Precision sourcing for Cessna &amp; Piper. High-traceability certified aviation components for the Indian training sector.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexDirection: isMobile ? 'column' : 'row' }}>
            <Link href="/marketplace" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="/login" style={secondaryButtonStyle}>Fleet Intel Login</Link>
          </div>
        </div>
      </section>

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

      {/* 4. CORE CAPABILITIES */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌐</div>
            <h3 style={featureTitleStyle}>Global Procurement</h3>
            <p style={featureTextStyle}>Direct access to MRO inventory in Singapore and USA hubs for rapid dispatch.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🛡️</div>
            <h3 style={featureTitleStyle}>Technical Verification</h3>
            <p style={featureTextStyle}>Every unit is sourced with full traceability and digital airworthiness documentation.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🚚</div>
            <h3 style={featureTitleStyle}>Hangar Delivery</h3>
            <p style={featureTextStyle}>Seamless customs handling and last-mile delivery to any flight school in India.</p>
          </div>
        </div>
      </section>

      {/* 5. PROFESSIONAL CONTACT HUB */}
      <section style={{ backgroundColor: '#001529', color: 'white', padding: isMobile ? '60px 20px' : '100px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
            URGENT SOURCING &amp; AOG
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>
            Contact our Chennai logistics desk for immediate part verification and shipping quotes.
          </p>
          
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: isMobile ? '20px' : '40px' }}>
            <a href={`tel:+919600038089`} style={contactBoxStyle}>
              <span style={{ color: '#ffb400', fontSize: '0.8rem', fontWeight: 'bold' }}>TELEPHONE</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>+91 96000 38089</span>
            </a>
            <a href={`mailto:${contactEmail}`} style={contactBoxStyle}>
              <span style={{ color: '#ffb400', fontSize: '0.8rem', fontWeight: 'bold' }}>OFFICIAL EMAIL</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>{contactEmail}</span>
            </a>
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
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          width={28} 
          height={28} 
        />
        <span style={{ marginLeft: '12px', fontWeight: '700', fontSize: '0.9rem' }}>SEND RFQ / AOG</span>
      </a>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#000c17', color: 'rgba(255,255,255,0.3)', padding: '40px 20px', textAlign: 'center', fontSize: '0.75rem' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | DGCA &amp; International Standards Compliance</p>
      </footer>
    </div>
  )
}

// STYLES (UNCHANGED)
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#001a35', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: '600' as const, fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px' };
const intelTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, border: '1px solid #ffb400', padding: '8px 15px', borderRadius: '4px' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const heroSectionStyle = { minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,12,23,0.7), rgba(0,12,23,0.7)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '16px 36px', borderRadius: '4px', textDecoration: 'none', fontWeight: '800' as const, fontSize: '1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '16px 36px', borderRadius: '4px', textDecoration: 'none', fontWeight: '800' as const, fontSize: '1rem', border: '2px solid white' };
const pulseBarContainer = { backgroundColor: '#001a35', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const pulseItem = { display: 'flex', alignItems: 'center', gap: '10px' };
const pulseDot = { height: '8px', width: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' };
const pulseLabel = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };
const pulseValue = { fontSize: '0.9rem', fontWeight: 'bold', color: 'white' };
const pulseDivider = { height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' };
const featureCardStyle = { textAlign: 'center' as const, padding: '20px' };
const featureTitleStyle = { color: '#001a35', fontSize: '1.3rem', fontWeight: '800', marginBottom: '15px' };
const featureTextStyle = { color: '#475569', lineHeight: '1.7', fontSize: '0.95rem' };
const contactBoxStyle = { display: 'flex', flexDirection: 'column' as const, backgroundColor: 'rgba(255,255,255,0.05)', padding: '25px 40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: 'white' };
const whatsappFloatingStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', textDecoration: 'none', boxShadow: '0 15px 30px rgba(37, 211, 102, 0.3)', zIndex: 10000 };