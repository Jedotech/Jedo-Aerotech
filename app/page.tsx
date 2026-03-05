import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* 1. WHATSAPP FLOATING BUTTON (AOG HOTLINE) */}
      <a 
        href="https://wa.me/919600038089" 
        target="_blank" 
        rel="noopener noreferrer"
        style={whatsappButtonStyle}
      >
        <span style={{ fontSize: '24px' }}>💬</span>
        <span style={{ fontWeight: 'bold' }}>WhatsApp AOG</span>
      </a>

      {/* 2. NAVIGATION BAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* LOGO FIX: Relative path and removed inversion filter */}
          <img 
            src="./jedo-logo.png" 
            alt="Jedo Tech Logo" 
            style={{ height: '45px', width: 'auto', display: 'block' }} 
          />
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '1px' }}>
            JEDO <span style={{ color: '#ffb400' }}>TECH</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section style={heroSectionStyle}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', fontWeight: '800' }}>Global Parts. <span style={{ color: '#ffb400' }}>Local Support.</span></h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '750px', margin: '0 auto 40px', opacity: '0.9', lineHeight: '1.5' }}>
          Chennai's Premier Sourcing Partner for Cessna, Piper, and Training Fleets. 
          Bridging the gap between global OEMs and Indian operators.
        </p>
        <a href="#rfq" style={heroButtonStyle}>
          REQUEST AOG QUOTE
        </a>
      </section>

      {/* 4. KEY SERVICES */}
      <section style={{ maxWidth: '1100px', margin: '80px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', color: '#002d5b', fontSize: '2.2rem', marginBottom: '50px' }}>Aviation Excellence in Chennai</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📜</div>
            <h4 style={featureTitleStyle}>Certified Paperwork</h4>
            <p style={featureTextStyle}>Full traceability with FAA 8130-3 and EASA Form 1 compliance for every component we source.</p>
          </div>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✈️</div>
            <h4 style={featureTitleStyle}>Fleet Specialist</h4>
            <p style={featureTextStyle}>Dedicated support for Cessna 152/172, Piper Archer, and Diamond training aircraft consumables.</p>
          </div>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
            <h4 style={featureTitleStyle}>Rapid Dispatch</h4>
            <p style={featureTextStyle}>Strategic hub in Tamil Nadu ensuring expedited pan-India shipping for urgent AOG requirements.</p>
          </div>
        </div>
      </section>

      {/* 5. RFQ SUBMISSION FORM */}
      <section id="rfq" style={formSectionStyle}>
        <h3 style={{ textAlign: 'center', color: '#002d5b', fontSize: '2rem', marginBottom: '10px' }}>Request for Quote</h3>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Submit details below for immediate pricing and lead-time analysis.</p>
        
        <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="hidden" name="_next" value="https://jedotech.com/success" />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div>
              <label style={labelStyle}>Part Number *</label>
              <input type="text" name="part_number" required style={inputField} placeholder="e.g. 066-5000-05" />
            </div>
            <div>
              <label style={labelStyle}>Aircraft Model</label>
              <input type="text" name="aircraft" style={inputField} placeholder="e.g. Cessna 172R" />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" name="email" required style={inputField} placeholder="purchasing@flightschool.com" />
          </div>
          
          <button type="submit" style={submitButtonStyle}>
            SUBMIT SOURCING REQUEST
          </button>
        </form>
      </section>

      {/* 6. PROFESSIONAL FOOTER */}
      <footer style={footerStyle}>
        <div style={footerGridStyle}>
          <div>
            <h3 style={{ color: '#ffb400', marginBottom: '15px' }}>JEDO TECHNOLOGIES</h3>
            <p style={{ opacity: '0.7', lineHeight: '1.6' }}>The premier sourcing agency for the global aviation industry, specializing in general aviation and training fleet components.</p>
          </div>
          <div>
            <h4 style={footerHeadingStyle}>Contact Details</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.8' }}>
              📍 Chennai, Tamil Nadu, India<br />
              📧 Email: contact@jedotech.com<br />
              📞 Phone: +91 96000 38089
            </p>
          </div>
          <div>
            <h4 style={footerHeadingStyle}>Quick Access</h4>
            <Link href="/inventory" style={footerLinkStyle}>→ Inventory Catalog</Link>
            <a href="#rfq" style={footerLinkStyle}>→ Request a Quote</a>
          </div>
        </div>
        <div style={footerBottomStyle}>
          © 2026 Jedo Technologies Pvt. Ltd. | <Link href="/studio" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Login</Link>
        </div>
      </footer>
    </div>
  )
}

// STYLING OBJECTS
const navStyle = { backgroundColor: '#002d5b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', position: 'sticky' as const, top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const heroSectionStyle = { padding: '120px 20px', background: 'linear-gradient(135deg, #002d5b 0%, #0056b3 100%)', color: 'white', textAlign: 'center' as const };
const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 45px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.2rem', boxShadow: '0 6px 25px rgba(255,180,0,0.4)' };
const featureBox = { padding: '40px', borderRadius: '20px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center' as const };
const featureTitleStyle = { fontSize: '1.2rem', margin: '10px 0', color: '#002d5b' };
const featureTextStyle = { fontSize: '0.95rem', color: '#555' };
const formSectionStyle = { maxWidth: '850px', margin: '100px auto', padding: '50px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.08)', borderTop: '8px solid #ffb400' };
const inputField = { padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', outline: 'none' };
const labelStyle = { display: 'block', fontWeight: 'bold' as const, fontSize: '0.9rem', marginBottom: '8px', color: '#002d5b' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.2rem' };
const footerStyle = { padding: '80px 20px', color: 'white', backgroundColor: '#001a35' };
const footerGridStyle = { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px' };
const footerHeadingStyle = { borderBottom: '2px solid #ffb400', paddingBottom: '10px', marginBottom: '20px' };
const footerLinkStyle = { color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' };
const footerBottomStyle = { textAlign: 'center' as const, marginTop: '80px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: '0.5', fontSize: '0.85rem' };
const whatsappButtonStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)', zIndex: 1000 };