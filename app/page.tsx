import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #0056b3', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3', margin: '0' }}>Jedo Technologies</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Aviation Sourcing & Support Specialists</p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Premium Aircraft Parts Sourcing</h2>
        <p>
          Based in Chennai, we specialize in the procurement of high-quality aircraft tyres, 
          brakes, and critical components for general aviation and training fleets.
        </p>
      </section>

      <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <h3>Aircraft We Support</h3>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', listStyle: 'none', padding: '0' }}>
          <li>✈️ Cessna 152 / 172 / 182</li>
          <li>✈️ Piper Archer / Seneca</li>
          <li>✈️ Beechcraft Baron / Bonanza</li>
          <li>✈️ Training & Light Aircraft</li>
        </ul>
      </section>

      <footer style={{ marginTop: '60px', fontSize: '0.9rem', color: '#666' }}>
        <p>© 2026 Jedo Technologies Pvt. Ltd. | Chennai, India</p>
        <Link href="/studio" style={{ color: '#0056b3', textDecoration: 'none' }}>
          Admin Portal (Inventory Management)
        </Link>
      </footer>
    </main>
  )
}