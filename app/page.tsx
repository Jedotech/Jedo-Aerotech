import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      
      {/* Header Section */}
      <header style={{ borderBottom: '3px solid #0056b3', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3', margin: '0', fontSize: '2.5rem' }}>Jedo Technologies</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '5px' }}>Reliable Aviation Sourcing | Chennai, India</p>
      </header>

      {/* About Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#002d5b' }}>Expert Aircraft Parts Sourcing</h2>
        <p>
          Specializing in <strong>Cessna, Piper, and Beechcraft</strong> components. 
          We bridge the gap between global suppliers and local operators to keep your fleet in the air.
        </p>
      </section>

      {/* RFQ Form Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', border: '1px solid #0056b3', marginTop: '40px' }}>
        <h3 style={{ color: '#0056b3', marginTop: '0' }}>Request for Quote (RFQ)</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Submit your requirements below. Our sourcing team will respond with availability and pricing.</p>
        
        {/* Formspree Live Endpoint with Redirect */}
        <form action="https://formspree.io/f/mdalbdqq" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Redirect to Success Page after submission */}
          <input type="hidden" name="_next" value="https://jedotech.com/success" />
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Part Number *</label>
            <input type="text" name="part_number" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="e.g. 066-5000-05" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Aircraft Model</label>
              <input type="text" name="aircraft" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="e.g. Cessna 172R" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Quantity</label>
              <input type="number" name="quantity" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="1" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Your Email Address *</label>
            <input type="email" name="email" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="purchasing@flight-school.com" />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>Additional Notes (AOG / Condition Required)</label>
            <textarea name="message" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', height: '80px' }} placeholder="e.g. Requirement is AOG. Need EASA Form 1."></textarea>
          </div>

          <button type="submit" style={{ backgroundColor: '#0056b3', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s' }}>
            Submit Quote Request
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '0.85rem', color: '#888' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>© 2026 Jedo Technologies Pvt. Ltd. | Chennai</p>
          <Link href="/studio" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
            🔒 Inventory Management
          </Link>
        </div>
      </footer>
    </main>
  )
}