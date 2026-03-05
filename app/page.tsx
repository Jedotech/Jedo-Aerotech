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
      <nav style={{ backgroundColor: '#002d5b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/jedo-logo.png" alt="Logo" style={{ height: '45px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '1px' }}>JEDO <span style={{ color: '#ffb400' }}>TECH</span></div>
        </div>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <a href="#rfq" style={{ color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' }}>GET QUOTE</a>
          <Link href="/studio" style={{ color: 'white', textDecoration: 'none', opacity: '0.8', fontSize: '0.9rem' }}>INVENTORY</Link>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section style={{ 
        padding: '120px 20px', 
        background: 'linear-gradient(135deg, #002d5b 0%, #0056b3 100%)', 
        color: 'white', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', fontWeight: '800' }}>Global Parts. <span style={{ color: '#ffb400' }}>Local Support.</span></h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '750px', margin: '0 auto 40px', opacity: '0.9', lineHeight: '1.5' }}>
          Chennai's Premier Sourcing Partner for Cessna, Piper, and Training Fleets. 
          Bridging the gap between global OEMs and Indian operators.
        </p>
        <a href="#rfq" style={{ backgroundColor: '#ffb400', color: '#002d5b', padding: '18px 45px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 6px 25px rgba(255,180,0,0.4)', transition: '0.3s' }}>
          REQUEST AOG QUOTE
        </a>
      </section>

      {/* 4. KEY SERVICES / WHY US */}
      <section style={{ maxWidth: '1100px', margin: '80px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', color: '#002d5b', fontSize: '2.2rem', marginBottom: '50px' }}>Aviation Excellence in Chennai</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📜</div>
            <h4 style={{ fontSize: '1.2rem', margin: '10px 0', color: '#002d5b' }}>Certified Paperwork</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Full traceability with FAA 8130-3 and EASA Form 1 compliance for every component we source.</p>
          </div>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✈️</div>
            <h4 style={{ fontSize: '1.2rem', margin: '10px 0', color: '#002d5b' }}>Fleet Specialist</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Dedicated support for Cessna 152/172, Piper Archer, and Diamond training aircraft consumables.</p>
          </div>
          <div style={featureBox}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
            <h4 style={{ fontSize: '1.2rem', margin: '10px 0', color: '#002d5b' }}>Rapid Dispatch</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Strategic hub in Tamil Nadu ensuring expedited pan-India shipping for urgent AOG requirements.</p>
          </div>
        </div>
      </section>

      {/* 5. RFQ SUBMISSION FORM */}
      <section id="rfq" style={{ maxWidth: '850px', margin: '100px auto', padding: '50px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.08)', borderTop: '8px solid #ffb400' }}>
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
          
          <div>
            <label style={labelStyle}>Requirement Details</label>
            <textarea name="message" placeholder="Condition (NE/OH), AOG Status, or Certification needs..." style={{ ...inputField, height: '120px' }}></textarea>
          </div>
          
          <button type="submit" style={{ backgroundColor: '#002d5b', color: '#ffb400', padding: '20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem', transition: '0.3s' }}>
            SUBMIT SOURCING REQUEST
          </button>
        </form>
      </section>

      {/* 6. PROFESSIONAL FOOTER */}
      <footer style={{ padding: '80px 20px', color: 'white', backgroundColor: '#001a35' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px' }}>
          <div>
            <h3 style={{ color: '#ffb400', marginBottom: '15px' }}>JEDO TECHNOLOGIES</h3>
            <p style={{ opacity: '0.7', lineHeight: '1.6' }}>The premier sourcing and procurement agency for the global aviation industry, specializing in general aviation components.</p>
          </div>
          <div>
            <h4 style={{ borderBottom: '2px solid #ffb400', paddingBottom: '10px', marginBottom: '20px' }}>Contact Details</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.8' }}>
              📍 Chennai, Tamil Nadu, India<br />
              📧 Email: contact@jedotech.com<br />
              📞 Phone: +91 96000 38089
            </p>
          </div>
          <div>
            <h4 style={{ borderBottom: '2px solid #ffb400', paddingBottom: '10px', marginBottom: '20px' }}>Quick Access</h4>
            <Link href="/studio" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>→ Inventory Dashboard</Link>
            <a href="#rfq" style={{ color: 'white', display: 'block', textDecoration: 'none' }}>→ Request a Quote</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '80px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: '0.5', fontSize: '0.85rem' }}>
          © 2026 Jedo Technologies Pvt. Ltd. | All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}

// STYLING OBJECTS
const featureBox = { padding: '40px', borderRadius: '20px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center' as const };
const inputField = { padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', outline: 'none' };
const labelStyle = { display: 'block', fontWeight: 'bold' as const, fontSize: '0.9rem', marginBottom: '8px', color: '#002d5b' };
const whatsappButtonStyle = {
  position: 'fixed' as const,
  bottom: '30px',
  right: '30px',
  backgroundColor: '#25D366',
  color: 'white',
  padding: '14px 24px',
  borderRadius: '50px',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)',
  zIndex: 1000,
  transition: '0.3s'
};