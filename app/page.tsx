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
        <h2 style={{ color: '#002d5b' }}>Your Partner in Aircraft Parts</h2>
        <p>
          We specialize in sourcing critical components for training fleets and general aviation. 
          From <strong>Main Tyres</strong> and <strong>Brake Assemblies</strong> to engine consumables, 
          we ensure your aircraft stays airworthy with the right certification.
        </p>
      </section>

      {/* Fleet Support Section */}
      <section style={{ backgroundColor: '#e9ecef', padding: '25px', borderRadius: '12px', marginBottom: '40px' }}>
        <h3 style={{ marginTop: '0' }}>Fleets Supported</h3>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', listStyle: 'none', padding: '0' }}>
          <li>✈️ <strong>Cessna:</strong> 152, 172 Skyhawk, 182</li>
          <li>✈️ <strong>Piper:</strong> Archer, Seneca, Warrior</li>
          <li>✈️ <strong>Beechcraft:</strong> Baron, Bonanza</li>
          <li>✈️ <strong>Diamond:</strong> DA20, DA40</li>
        </ul>
      </section>

      {/* Contact / RFQ Section */}
      <section style={{ border: '2px dashed #0056b3', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
        <h3 style={{ color: '#0056b3' }}>Need a Quote?</h3>
        <p>Send us your Part Number and Aircraft Type for an immediate RFQ response.</p>
        
        <a 
          href="mailto:contact@jedotech.com" 
          style={{ 
            display: 'inline-block', 
            backgroundColor: '#0056b3', 
            color: 'white', 
            padding: '12px 30px', 
            borderRadius: '5px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          📧 Email: contact@jedotech.com
        </a>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '0.85rem', color: '#888' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>© 2026 Jedo Technologies Pvt. Ltd. | Chennai</p>
          <Link href="/studio" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
            🔒 Admin Portal
          </Link>
        </div>
      </footer>
    </main>
  )
}