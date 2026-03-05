import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav style={{ backgroundColor: '#ffffff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#002d5b' }}>JEDO <span style={{ color: '#0056b3' }}>TECH</span></div>
        <div style={{ display: 'flex', gap: '25px' }}>
          <a href="#rfq" style={{ color: '#002d5b', textDecoration: 'none', fontWeight: '500' }}>Request Quote</a>
          <Link href="/studio" style={{ backgroundColor: '#002d5b', color: 'white', padding: '8px 18px', borderRadius: '5px', textDecoration: 'none' }}>Admin Login</Link>
        </div>
      </nav>

      {/* 2. HERO SECTION (The "Aviation" Look) */}
      <section style={{ 
        height: '400px', 
        background: 'linear-gradient(rgba(0,45,91,0.8), rgba(0,45,91,0.8)), url("https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070") center/cover', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Precision Sourcing</h1>
        <p style={{ fontSize: '1.4rem', maxWidth: '600px', opacity: '0.9' }}>Reliable parts and consumables for Cessna, Piper, and Diamond fleets.</p>
      </section>

      {/* 3. CONTENT AREA */}
      <main style={{ maxWidth: '1100px', margin: '-50px auto 40px', padding: '0 20px' }}>
        
        {/* SERVICE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={cardStyle}>
            <div style={iconStyle}>🔧</div>
            <h3>Certified Parts</h3>
            <p>FAA 8130-3 and EASA Form 1 certified tyres, brakes, and electrical components.</p>
          </div>
          <div style={cardStyle}>
            <div style={iconStyle}>📦</div>
            <h3>Global Logistics</h3>
            <p>Fast regional shipping from Chennai to your MRO or flight school facility.</p>
          </div>
          <div style={cardStyle}>
            <div style={iconStyle}>🕒</div>
            <h3>AOG Support</h3>
            <p>24/7 dedicated sourcing for Aircraft on Ground situations to minimize downtime.</p>
          </div>
        </div>

        {/* RFQ FORM SECTION */}
        <section id="rfq" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '5px solid #0056b3' }}>
          <h2 style={{ textAlign: 'center', color: '#002d5b', marginBottom: '30px' }}>Submit an RFQ</h2>
          
          <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input type="hidden" name="_next" value="https://jedotech.com/success" />
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Part Number *</label>
              <input type="text" name="part_number" required style={inputStyle} placeholder="e.g. 066-5000-05" />
            </div>

            <div>
              <label style={labelStyle}>Aircraft Type</label>
              <input type="text" name="aircraft" style={inputStyle} placeholder="Cessna 172R" />
            </div>

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" name="email" required style={inputStyle} placeholder="yourname@email.com" />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={{ 
                width: '100%', 
                backgroundColor: '#0056b3', 
                color: 'white', 
                padding: '15px', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}>
                Get Price & Availability
              </button>
            </div>
          </form>
        </section>

      </main>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '0.9rem' }}>
        © 2026 Jedo Technologies Pvt. Ltd. | Chennai, Tamil Nadu
      </footer>
    </div>
  )
}

// Styling Objects for a clean look
const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' as const };
const iconStyle = { fontSize: '2.5rem', marginBottom: '15px' };
const labelStyle = { display: 'block', fontWeight: 'bold' as const, fontSize: '0.9rem', marginBottom: '5px', color: '#555' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' };