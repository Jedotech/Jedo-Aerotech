import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* 1. WHATSAPP AOG HOTLINE (FLOATING) */}
      <a 
        href="https://wa.me/919600038089" 
        target="_blank" 
        rel="noopener noreferrer"
        style={whatsappButtonStyle}
      >
        <span style={{ fontSize: '24px' }}>💬</span>
        <span style={{ fontWeight: 'bold' }}>AOG HOTLINE</span>
      </a>

      {/* 2. NAVIGATION BAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            <img 
              src="./jedo-logo.png" 
              alt="Jedo Technologies" 
              style={{ height: '45px', width: 'auto', cursor: 'pointer' }} 
            />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 3. HERO SECTION: FULL WIDTH OVERLAY */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '900px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9', fontWeight: '400' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and training fleets. <br/>
            Certified airworthiness with seamless Indian customs clearance.
          </p>
          <a href="#rfq" style={heroButtonStyle}>REQUEST AOG QUOTE</a>
        </div>
      </section>

      {/* 4. TRUST STRIP (CERTIFICATIONS) */}
      <div style={trustStripStyle}>
        <span style={{ color: '#64748b', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>
          CERTIFIED TRACEABILITY: FAA 8130-3 | EASA FORM 1 | DGCA COMPLIANT
        </span>
      </div>

      {/* 5. THE JEDO 3-STEP QUALITY CHECK */}
      <section style={{ padding: '100px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#002d5b', fontSize: '2.5rem', fontWeight: '800', marginBottom: '60px' }}>
            The Jedo Sourcing Standard
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {/* STEP 1 */}
            <div style={trustBoxStyle}>
              <div style={stepNumberStyle}>01</div>
              <h3 style={trustTitleStyle}>Global Sourcing</h3>
              <p style={trustTextStyle}>
                Direct access to OEM-authorized distributors in the US and Europe. We verify all certification digitally before procurement begins.
              </p>
            </div>

            {/* STEP 2 */}
            <div style={trustBoxStyle}>
              <div style={stepNumberStyle}>02</div>
              <h3 style={trustTitleStyle}>Quality Inspection</h3>
              <p style={trustTextStyle}>
                Physical verification of airworthiness tags at our international consolidation hubs to ensure serial number accuracy.
              </p>
            </div>

            {/* STEP 3 */}
            <div style={trustBoxStyle}>
              <div style={stepNumberStyle}>03</div>
              <h3 style={trustTitleStyle}>Local Logistics</h3>
              <p style={trustTextStyle}>
                We handle Chennai Customs clearance and last-mile delivery. Pay in INR and avoid international wire and duty complexities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RFQ SECTION WITH BOLD FORMS */}
      <section id="rfq" style={{ padding: '120px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h2 style={{ color: '#002d5b', fontSize: '2.8rem', fontWeight: '800', textAlign: 'center', marginBottom: '10px' }}>Ready to Source?</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '50px', fontSize: '1.1rem' }}>Submit your requirements for a priority quotation.</p>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input type="text" name="part_number" placeholder="Part Number(s) *" required style={boldInputStyle} />
              <input type="text" name="aircraft" placeholder="Aircraft Model" style={boldInputStyle} />
            </div>
            <input type="email" name="email" placeholder="Your Official Email Address *" required style={boldInputStyle} />
            <textarea name="message" placeholder="Additional details (Condition, Quantity, Urgency...)" rows={5} style={boldInputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND SOURCING REQUEST</button>
          </form>
        </div>
      </section>

      {/* 7. PROFESSIONAL FOOTER */}
      <footer style={footerStyle}>
        <div style={footerGridStyle}>
          <div>
            <h3 style={{ color: '#ffb400', marginBottom: '20px', fontWeight: '800' }}>JEDO TECHNOLOGIES</h3>
            <p style={{ opacity: '0.6', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Specialized aircraft parts procurement for flight schools and general aviation operators across India.
            </p>
          </div>
          <div>
            <h4 style={footerHeadingStyle}>Operations</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Chennai, Tamil Nadu<br/>
              India
            </p>
          </div>
          <div>
            <h4 style={footerHeadingStyle}>Support</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.7' }}>
              📧 contact@jedotech.com<br/>
              📞 +91 96000 38089
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center' as const, marginTop: '60px', opacity: '0.4', fontSize: '0.8rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | Aviation Excellence
        </div>
      </footer>
    </div>
  )
}

// STYLING OBJECTS
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem', letterSpacing: '0.5px' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };

const heroSectionStyle = { 
  height: '85vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundImage: 'linear-gradient(rgba(0, 45, 91, 0.75), rgba(0, 45, 91, 0.75)), url("./hero-aircraft.png")', 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  color: 'white', 
  textAlign: 'center' as const 
};

const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '20px 50px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' };
const trustStripStyle = { backgroundColor: '#f1f5f9', padding: '25px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' as const };

// TRUST SECTION STYLES
const trustBoxStyle = { backgroundColor: 'white', padding: '45px', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', borderTop: '5px solid #ffb400', position: 'relative' as const };
const stepNumberStyle = { fontSize: '4rem', fontWeight: '900', color: 'rgba(0, 45, 91, 0.05)', position: 'absolute' as const, top: '5px', right: '25px' };
const trustTitleStyle = { color: '#002d5b', fontSize: '1.4rem', marginBottom: '15px', fontWeight: '800' as const };
const trustTextStyle = { color: '#64748b', lineHeight: '1.7', fontSize: '1rem' };

// BOLD FORM STYLES
const boldInputStyle = { 
  padding: '18px', 
  borderRadius: '8px', 
  border: '2px solid #002d5b', 
  width: '100%', 
  fontSize: '1rem', 
  outline: 'none', 
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  color: '#002d5b',
  fontWeight: '500'
};

const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '8px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.2rem', marginTop: '10px', boxShadow: '0 10px 20px rgba(0,45,91,0.2)' };

// FOOTER STYLES
const footerStyle = { backgroundColor: '#001a35', color: 'white', padding: '100px 40px' };
const footerGridStyle = { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px' };
const footerHeadingStyle = { marginBottom: '25px', fontSize: '1.1rem', fontWeight: '800', borderBottom: '2px solid #ffb400', paddingBottom: '10px', display: 'inline-block' };

const whatsappButtonStyle = { position: 'fixed' as const, bottom: '40px', right: '40px', backgroundColor: '#25D366', color: 'white', padding: '15px 30px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 15px 30px rgba(37, 211, 102, 0.4)', zIndex: 1000 };