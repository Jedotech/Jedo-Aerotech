import Link from 'next/link'

export default function HomePage() {
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

      {/* 3. LOGO BAR (NEW) */}
      <div style={{ backgroundColor: '#f8fafc', padding: '30px 0', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '2px', marginBottom: '15px' }}>SUPPORTING PLATFORMS</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', opacity: 0.5, filter: 'grayscale(100%)' }}>
          <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#64748b' }}>CESSNA</span>
          <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#64748b' }}>PIPER</span>
          <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#64748b' }}>BEECHCRAFT</span>
          <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#64748b' }}>CIRRUS</span>
        </div>
      </div>

      {/* 4. CORE CAPABILITIES (NEW) */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div style={featureCardStyle}>
            <div style={iconStyle}>✈️</div>
            <h3 style={featureTitleStyle}>Global Procurement</h3>
            <p style={featureTextStyle}>Direct access to MRO inventory in Singapore, Dubai, and USA hubs for rapid dispatch.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}>🛡️</div>
            <h3 style={featureTitleStyle}>Quality Assured</h3>
            <p style={featureTextStyle}>Every tyre is sourced with full traceability and digital airworthiness documentation.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}>📦</div>
            <h3 style={featureTitleStyle}>Hangar Delivery</h3>
            <p style={featureTextStyle}>Seamless customs handling and last-mile delivery to any flight school in India.</p>
          </div>
        </div>
      </section>

      {/* 5. LIVE HUB STATUS (NEW) */}
      <section style={{ backgroundColor: '#002d5b', color: 'white', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#ffb400', margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>OPERATIONAL STATUS</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '5px 0 0' }}>Chennai & Singapore Hubs: <span style={{ color: '#10b981' }}>ONLINE</span></p>
          </div>
          <Link href="/marketplace#rfq" style={{ backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 30px', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none' }}>
            Request Offline Sourcing
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'rgba(255,255,255,0.4)', padding: '60px 20px', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Aviation MRO & Sourcing Excellence</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', opacity: 0.7 };
const intelTabStyle = { color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', border: '1px solid #ffb400', padding: '8px 15px', borderRadius: '4px' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const heroSectionStyle = { minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.6), rgba(0,45,91,0.6)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };

// NEW SECTION STYLES
const featureCardStyle = { textAlign: 'center' as const, padding: '20px' };
const iconStyle = { fontSize: '3rem', marginBottom: '20px' };
const featureTitleStyle = { color: '#002d5b', fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' };
const featureTextStyle = { color: '#64748b', lineHeight: '1.6', fontSize: '1rem' };