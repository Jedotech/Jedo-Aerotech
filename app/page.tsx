import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={navStyle}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} />
        <div style={{ display: 'flex', gap: '30px' }}>
          <Link href="/marketplace" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>MARKETPLACE</Link>
          <Link href="/#rfq" style={{ color: '#ffb400', textDecoration: 'none', fontWeight: 'bold' }}>REQUEST SOURCING</Link>
        </div>
      </nav>

      <section style={heroStyle}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900' }}>THE TYRE HUB FOR <br /><span style={{ color: '#ffb400' }}>TRAINING FLEETS.</span></h1>
        <p style={{ fontSize: '1.4rem', margin: '20px 0 40px' }}>Specialized brokerage for Cessna & Piper. Sourced globally, delivered locally.</p>
        <Link href="/marketplace" style={primaryBtn}>Explore Marketplace</Link>
      </section>
      
      {/* Rest of your original home sections... */}
    </div>
  )
}

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#002d5b' };
const heroStyle = { height: '80vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'center', textAlign: 'center' as const, backgroundColor: '#002d5b', color: 'white', backgroundImage: 'linear-gradient(rgba(0,45,91,0.7), rgba(0,45,91,0.7)), url("/hero-aircraft.png")', backgroundSize: 'cover' };
const primaryBtn = { backgroundColor: '#ffb400', color: '#002d5b', padding: '15px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' as const };