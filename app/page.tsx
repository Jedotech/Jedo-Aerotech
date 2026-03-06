import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. WHATSAPP AOG BUTTON */}
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
          {/* Using ./ to ensure it looks in the public folder on GitHub Pages */}
          <img 
            src="./jedo-logo.png" 
            alt="Jedo Technologies" 
            style={{ height: '45px', width: 'auto' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/inventory" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 3. HERO SECTION: FULL WIDTH OVERLAY */}
      <section style={{ 
        position: 'relative',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 45, 91, 0.7), rgba(0, 45, 91, 0.7)), url("./hero-aircraft.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '0 20px'
      }}>
        <div style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and training fleets. <br/>
            Certified parts with seamless Indian customs clearance.
          </p>
          <a href="#rfq" style={heroButtonStyle}>REQUEST AOG QUOTE</a>
        </div>
      </section>

      {/* 4. TRUST STRIP */}
      <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' as const }}>
        <span style={{ color: '#64748b', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>
          CERTIFIED TRACEABILITY: FAA 8130-3 | EASA FORM 1 | DGCA COMPLIANT
        </span>
      </div>

      {/* 5. RFQ SECTION */}
      <section id="rfq" style={{ padding: '100px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '10px' }}>Ready to Source?</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '50px' }}>Submit your requirements for a priority quotation.</p>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" name="part_number" placeholder="Part Number(s) *" required style={inputStyle} />
            <input type="text" name="aircraft" placeholder="Aircraft Model" style={inputStyle} />
            <input type="email" name="email" placeholder="Your Email Address *" required style={inputStyle} />
            <textarea name="message" placeholder="Additional details (Condition, Qty...)" rows={4} style={inputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND REQUEST</button>
          </form>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px' }}>
          <div>
            <h3 style={{ color: '#ffb400', marginBottom: '20px' }}>JEDO TECHNOLOGIES</h3>
            <p style={{ opacity: '0.6', lineHeight: '1.7', fontSize: '0.95rem' }}>The specialized sourcing partner for flight schools and operators across India.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Headquarters</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Chennai, Tamil Nadu<br/>
              India
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Contact</h4>
            <p style={{ opacity: '0.8', fontSize: '0.95rem', lineHeight: '1.7' }}>
              📧 contact@jedotech.com<br/>
              📞 +91 96000 38089
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.85rem' };
const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '20px 50px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem', display: 'inline-block' };
const inputStyle = { padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' };
const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '18px', borderRadius: '6px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };
const whatsappButtonStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', zIndex: 1000 };