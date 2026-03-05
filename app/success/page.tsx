import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main style={{ padding: '40px', maxWidth: '600px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '50px', marginBottom: '20px' }}>✈️</div>
      <h1 style={{ color: '#0056b3' }}>RFQ Received Successfully</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#333' }}>
        Thank you for contacting <strong>Jedo Technologies</strong>. 
        Our sourcing team in Chennai has received your request and will 
        provide a quote within 4 to 12 hours.
      </p>
      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
      <Link href="/" style={{ color: '#0056b3', fontWeight: 'bold', textDecoration: 'none' }}>
        ← Return to Home Page
      </Link>
    </main>
  )
}