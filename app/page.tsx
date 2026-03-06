import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. WHATSAPP AOG BUTTON */}
      <a href="https://wa.me/919600038089" target="_blank" rel="noopener noreferrer" style={whatsappButtonStyle}>
        <span style={{ fontSize: '24px' }}>💬</span>
        <span style={{ fontWeight: 'bold' }}>AOG HOTLINE</span>
      </a>

      {/* 2. NAVIGATION BAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            <img src="./jedo-logo.png" alt="Jedo Technologies" style={{ height: '45px', width: 'auto', cursor: 'pointer' }} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={navLinkStyle}>HOME</Link>
          <Link href="/inventory" style={navLinkStyle}>INVENTORY</Link>
          <a href="#rfq" style={quoteButtonStyle}>GET QUOTE</a>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px' }}>
            GLOBAL PARTS. <span style={{ color: '#ffb400' }}>LOCAL SUPPORT.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '40px', opacity: '0.9' }}>
            Chennai's premier sourcing agency for Cessna, Piper, and training fleets.
          </p>
          <a href="#rfq" style={heroButtonStyle}>REQUEST AOG QUOTE</a>
        </div>
      </section>

      {/* 4. RFQ SECTION WITH BOLD TABLES */}
      <section id="rfq" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#002d5b', fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '10px' }}>Ready to Source?</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '50px' }}>Submit your requirements for a priority quotation.</p>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <input type="text" name="part_number" placeholder="Part Number(s) *" required style={boldInputStyle} />
            <input type="text" name="aircraft" placeholder="Aircraft Model" style={boldInputStyle} />
            <input type="email" name="email" placeholder="Your Email Address *" required style={boldInputStyle} />
            <textarea name="message" placeholder="Additional details..." rows={4} style={boldInputStyle}></textarea>
            <button type="submit" style={submitButtonStyle}>SEND REQUEST</button>
          </form>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer style={{ backgroundColor: '#001a35', color: 'white', padding: '60px 40px', textAlign: 'center' }}>
        <p>© 2026 Jedo Technologies | Chennai, India</p>
      </footer>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', backgroundColor: '#002d5b', position: 'sticky' as const, top: 0, zIndex: 100 };
const navLinkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '0.9rem' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '10px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const };
const heroSectionStyle = { height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(0, 45, 91, 0.7), rgba(0, 45, 91, 0.7)), url("./hero-aircraft.png")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center' as const };
const heroButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '20px 50px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' as const, fontSize: '1.1rem' };

// BOLD INPUT STYLE FIX
const boldInputStyle = { 
  padding: '18px', 
  borderRadius: '8px', 
  border: '2px solid #002d5b', // Bold dark blue border
  width: '100%', 
  fontSize: '1rem', 
  outline: 'none', 
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle depth
  fontWeight: '500'
};

const submitButtonStyle = { backgroundColor: '#002d5b', color: '#ffb400', padding: '18px', borderRadius: '8px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '1.1rem' };
const whatsappButtonStyle = { position: 'fixed' as const, bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000 };