import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* 1. MOBILE-RESPONSIVE ENGINE (CSS) */}
      <style>{`
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .hero-title { font-size: 2.5rem !important; }
          .hero-text { font-size: 1.1rem !important; }
          .trust-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .rfq-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
          .desktop-nav { display: none !important; }
        }
      `}</style>

      {/* 2. WHATSAPP AOG HOTLINE */}
      <a href="https://wa.me/919600038089" target="_blank" rel="noopener noreferrer" style={whatsappButtonStyle}>
        <span style={{ fontSize: '20px' }}>💬</span>
        <span style={{ fontWeight: 'bold' }}>AOG</span>
      </a>

      {/* 3. NAVIGATION BAR */}
      <nav className="nav-container" style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '40px', width: 'auto', cursor: 'pointer' }} />
          </Link>
        </div>
        <div className="desktop-nav" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '900px', padding: '0 20px' }}>
          <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p className="hero-text" style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and training fleets.
          </p>
          <a href="#rfq" style={heroButtonStyle}>REQUEST QUOTE</a>
        </div>
      </section>

      {/* 5. TRUST STRIP */}
      <div style={trustStripStyle}>
        <span style={{ color: '#64748b', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.75rem' }}>
          FAA 8130-3 | EASA FORM 1 | DGCA COMPLIANT
        </span>
      </div>

      {/* 6. 3-STEP QUALITY CHECK (RESPONSIVE GRID) */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#002d5b', fontSize: '2rem', fontWeight: '800', marginBottom: '40px' }}>
            The Jedo Sourcing Standard
          </h2>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={trustBoxStyle}>
              <h3 style={trustTitleStyle}>01. Global Sourcing</h3>
              <p style={trustTextStyle}>Direct access to OEM-authorized distributors in US/Europe.</p>
            </div>
            <div style={trustBoxStyle}>
              <h3 style={trustTitleStyle}>02. Quality Check</h3>
              <p style={trustTextStyle}>Physical verification of airworthiness tags at our hubs.</p>
            </div>
            <div style={trustBoxStyle}>
              <h3 style={trustTitleStyle}>03. Local Delivery</h3>
              <p style={trustTextStyle}>Customs clearance in Chennai. No international wire hassles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RFQ SECTION */}
      <section id="rfq" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#002d5b', fontSize: '2.2rem', fontWeight: '800', textAlign: 'center', marginBottom: '40px' }}>Ready to Source?</h2>
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="rfq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" name="part_number" placeholder="Part Number *" required style={boldInputStyle} />
              <input type="text" name="aircraft" placeholder="Aircraft Model" style={boldInputStyle} />
            </div>
            <input type="email" name="email" placeholder="Your Official Email *" required style={boldInputStyle} />
            <textarea name="message" placeholder="Details..." rows={4} style={boldInputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND REQUEST</button>
          </form>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px' }}>
        <div className="footer-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px' }}>
          <div><h4 style={{ color: '#ffb400' }}>JEDO TECH</h4><p style={{ opacity: '0.6', fontSize: '0.9rem' }}>Aviation Sourcing, Chennai.</p></div>
          <div><h4>Contact</h4><p style={{ opacity: '0.8', fontSize: '0.9rem' }}>contact@jedotech.com<br/>+91 96000 38089</p></div>
        </div>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.8rem' };
const heroSectionStyle = { minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0, 45, 91, 0.75), rgba(0, 45, 91, 0.75)), url("/hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1rem', display: 'inline-block' };
const trustStripStyle = { backgroundColor: '#f1f5f9', padding: '15px', textAlign: 'center' as const, borderBottom: '1px solid #e2e8f0' };
const trustBoxStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #ffb400' };
const trustTitleStyle = { color: '#002d5b', fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' as const };
const trustTextStyle = { color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' };
const boldInputStyle = { padding: '15px', borderRadius: '6px', border: '2px solid #002d5b', width: '100%', fontSize: '1rem', outline: 'none', fontWeight: '600' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '15px', borderRadius: '6px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };
const whatsappButtonStyle = { position: 'fixed' as const, bottom: '20px', right: '20px', backgroundColor: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };