import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* NAVIGATION BAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto' }} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/marketplace" style={navLinkStyle}>MARKETPLACE</Link>
          <Link href="https://jedo-fleet-intel.vercel.app" style={navLinkStyle}>FLEET INTELLIGENCE</Link>
          <a href="#rfq" style={quoteButtonStyle}>REQUEST SOURCING</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1100px', padding: '0 20px', zIndex: 2 }}>
          <h1 style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            THE TYRE HUB FOR <br />
            <span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span>
          </h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', maxWidth: '850px', margin: '0 auto 40px', opacity: 0.95 }}>
            Specialized brokerage for Cessna & Piper. We source, verify, and deliver certified aviation tyres to your hangar.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/marketplace" style={primaryButtonStyle}>Browse Marketplace</Link>
            <Link href="https://jedo-fleet-intel.vercel.app" style={secondaryButtonStyle}>Fleet Intel Login</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#002d5b', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Aviation MRO & Sourcing</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 1000 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const heroSectionStyle = { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0,45,91,0.6), rgba(0,45,91,0.6)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#002d5b', color: 'white', textAlign: 'center' as const };
const primaryButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };
const secondaryButtonStyle = { backgroundColor: 'transparent', color: 'white', padding: '18px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', border: '2px solid white' };