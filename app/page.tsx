import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* 1. WHATSAPP FLOATING BUTTON */}
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
          <img 
            src="./jedo-logo.png" 
            alt="Jedo Technologies" 
            style={{ height: '40px', width: 'auto' }} 
          />
          <div style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '1px', color: '#002d5b' }}>
            JEDO <span style={{ color: '#ffb400' }}>TECHNOLOGIES</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/inventory" style={{ color: '#002d5b', textDecoration: 'none', fontWeight: 'bold' }}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 3. HERO SECTION: SPLIT DESIGN */}
      <section style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        minHeight: '80vh',
        alignItems: 'stretch'
      }}>
        {/* LEFT SIDE: TEXT & VALUE */}
        <div style={{ 
          flex: '1', 
          padding: '80px 60px', 
          backgroundColor: '#002d5b', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
            Global Parts.<br/>
            <span style={{ color: '#ffb400' }}>Local Support.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9', maxWidth: '500px' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and Diamond training fleets. We bridge the gap between global OEMs and Indian operators.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#rfq" style={heroButtonStyle}>REQUEST A QUOTE</a>
            <Link href="/inventory" style={secondaryButtonStyle}>VIEW INVENTORY</Link>
          </div>
        </div>

        {/* RIGHT SIDE: THE AIRCRAFT IMAGE */}
        <div style={{ 
          flex: '1', 
          minWidth: '400px',
          backgroundImage: 'url("./hero-aircraft.jpg")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          minHeight: '400px'
        }}>
        </div>
      </section>

      {/* 4. TRUST BAR */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '20px', textAlign: 'center' as const, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        FAA 8130-3 & EASA FORM 1 CERTIFIED PARTS ONLY
      </div>

      {/* 5. RFQ SECTION */}
      <section id="rfq" style={{ maxWidth: '1000px', margin: '100px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#002d5b', fontSize: '2.5rem', marginBottom: '20px' }}>Ready to fly?</h2>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '1.1rem' }}>
              Our Chennai-based team handles everything from international procurement to Indian customs clearance. Submit your part numbers for a 24-hour turnaround.
            </p>
          </div>
          
          <div style={formContainerStyle}>
            <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" name="part_number" placeholder="Part Number *" required style={inputStyle} />
              <input type="text" name="aircraft" placeholder="Aircraft Model (e.g. C172)" style={inputStyle} />
              <input type="email" name="email" placeholder="Your Email *" required style={inputStyle} />
              <button type="submit" style={submitButtonStyle}>GET PRICE & LEAD TIME</button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <h4 style={{ color: '#ffb400', marginBottom: '15px' }}>JEDO TECH</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Aviation Sourcing Excellence.<br/>Chennai, Tamil Nadu.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px' }}>Contact</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>contact@jedotech.com<br/>+91 96000 38089</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', sticky: 'top', zIndex: 100 };
const quoteButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 35px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1rem' };
const secondaryButtonStyle = { border: '2px solid white', color: 'white', padding: '13px 35px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1rem' };
const formContainerStyle = { backgroundColor: '#f8fafc', padding: '40px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px', borderRadius: '6px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1rem' };
const whatsappButtonStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', zIndex: 1000 };