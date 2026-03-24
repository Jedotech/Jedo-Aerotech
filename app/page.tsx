'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// Updated to point to your fleet dataset as discussed
const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'fleet', 
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, health: 98 });
  const [isMobile, setIsMobile] = useState(false);

  // Sync Mobile State & Fetch Stats
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    async function fetchStats() {
      // Querying the new 'aircraft' schema for global fleet health
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
  const contactEmail = "tajesudoss@gmail.com";

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav style={{...navStyle, padding: isMobile ? '15px 20px' : '20px 60px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: isMobile ? '35px' : '45px', width: 'auto' }} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '12px' : '25px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/marketplace" style={navLinkStyle}>MARKETPLACE</Link>
          <Link href="https://jedo-fleet-intel.vercel.app" target="_blank" rel="noopener noreferrer" style={{...intelTabStyle, fontSize: isMobile ? '0.7rem' : '0.85rem'}}>
            FLEET INTEL ↗
          </Link>
          <Link href="/marketplace#rfq" style={{...quoteButtonStyle, padding: isMobile ? '8px 12px' : '12px 25px', fontSize: isMobile ? '0.7rem' : '0.85rem'}}>REQUEST SOURCING</Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{...heroSectionStyle, padding: isMobile ? '80px 20px' : '0'}}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: isMobile ? '2.8rem' : '5rem', 
            fontWeight: '900', 
            marginBottom: '15px', 
            lineHeight: '1.1', 
            textShadow: '2px 2px 10px rgba(0,0,0,0.3)' 
          }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: '600', maxWidth: '850px', margin: '0 auto 40px', opacity: 0.95 }}>
            Specialized brokerage for Cessna & Piper. We source, verify, and deliver certified aviation tyres to your hangar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
            <Link href="/marketplace" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="https://jedo-fleet-intel.vercel.app" target="_blank" style={secondaryButtonStyle}>Fleet Intel Login</Link>
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

      {/* 4. LOGO BAR */}
      <div style={{ backgroundColor: '#ffffff', padding: '40px 0', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#cbd5e1', letterSpacing: '2px', marginBottom: '20px' }}>SUPPORTED AIRCRAFT PLATFORMS</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '20px' : '60px', opacity: 0.4, flexWrap: 'wrap', padding: '0 20px' }}>
          <span style={platformLabelStyle}>CESSNA</span>
          <span style={platformLabelStyle}>PIPER</span>
          <span style={platformLabelStyle}>BEECHCRAFT</span>
          <span style={platformLabelStyle}>CIRRUS</span>
        </div>
      </div>

      {/* 5. CORE CAPABILITIES */}
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
            <p style={featureTextStyle}>Every tyre is sourced with full traceability and digital airworthiness documentation.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🚚</div>
            <h3 style={featureTitleStyle}>Hangar Delivery</h3>
            <p style={featureTextStyle}>Seamless customs handling and last-mile delivery to any flight school in India.</p>
          </div>
        </div>
      </section>

      {/* 6. CONTACT HUB */}
      <section style={{ backgroundColor: '#f8fafc', padding: isMobile ? '60px 20px' : '80px 20px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        <h2 style={{ color: '#002d5b', fontWeight: '900', marginBottom: '10px', fontSize: isMobile ? '1.5rem' : '2rem' }}>DIRECT LINE TO LOGISTICS</h2>
        <p style={{ color: '#64748b', marginBottom: '35px', fontSize: '1rem' }}>Speak with our Chennai sourcing hub today.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '25px' : '50px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
          <a href={`tel:+${whatsappNumber}`} style={contactMethodStyle}>
            <span style={{fontSize: '1.5rem'}}>📞</span> +91 96000 38089
          </a>
          <a href={`mailto:${contactEmail}`} style={contactMethodStyle}>
            <span style={{fontSize: '1.5rem'}}>✉️</span> {contactEmail}
          </a>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=Hello%20Jedo%20Technologies,%20I%20am%20interested%20in%20aircraft%20tyre%20sourcing.`} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{...whatsappFloatingStyle, padding: isMobile ? '12px' : '12px 20px'}}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '30px', height: '30px' }} />
        {!isMobile && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Chat with Us</span>}
      </a>

      {/* 7. FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'rgba(255,255,255,0.4)', padding: '60px 20px', textAlign: 'center', fontSize: '0.85rem' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Sourcing Excellence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', opacity: 0.7 };
const intelTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem', border: '1px solid #ffb400', padding: '8px 15px', borderRadius: '4px' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };

const heroSectionStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.6), rgba(0,45,91,0.6)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };

const pulseBarContainer = { backgroundColor: '#002d5b', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const pulseItem = { display: 'flex', alignItems: 'center', gap: '10px' };
const pulseDot = { height: '8px', width: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' };
const pulseLabel = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };
const pulseValue = { fontSize: '0.9rem', fontWeight: 'bold', color: 'white' };
const pulseDivider = { height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' };

const featureCardStyle = { textAlign: 'center' as const, padding: '20px' };
const featureTitleStyle = { color: '#002d5b', fontSize: '1.4rem', fontWeight: '900', marginBottom: '15px' };
const featureTextStyle = { color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem' };
const platformLabelStyle = { fontWeight: '900' as const, fontSize: '1.1rem', color: '#cbd5e1' };

const contactMethodStyle = { color: '#002d5b', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' };

const whatsappFloatingStyle = {
  position: 'fixed' as const,
  bottom: '30px',
  right: '30px',
  backgroundColor: '#25D366',
  color: 'white',
  borderRadius: '50px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  zIndex: 10000,
  transition: 'transform 0.3s ease'
};