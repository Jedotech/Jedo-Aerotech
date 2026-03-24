'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from 'next-sanity'

// TYPE-SAFE INTERFACE
interface AviationPart {
  _id: string;
  partNumber: string;
  description: string;
  price?: number;
  condition?: string;
  stockStatus?: string;
  imageUrl?: string;
}

const client = createClient({
  projectId: 'm2pa474h', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
})

export default function Marketplace() {
  const [parts, setParts] = useState<AviationPart[]>([])
  const [filteredParts, setFilteredParts] = useState<AviationPart[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function fetchParts() {
      const query = `*[_type == "part"]{
        _id,
        partNumber,
        description,
        price,
        condition,
        stockStatus,
        "imageUrl": image.asset->url
      }`
      try {
        const data = await client.fetch(query)
        setParts(data)
        setFilteredParts(data)
      } catch (e) {
        console.error("Marketplace fetch error", e)
      }
    }
    fetchParts()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // SEARCH LOGIC
  useEffect(() => {
    const results = parts.filter((part) =>
      part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParts(results)
  }, [searchTerm, parts])

  const whatsappNumber = "919600038089"

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <nav style={navStyle}>
        <Link href="/">
          <img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px' }} />
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search Parts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBarStyle} 
          />
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>HOME</Link>
        </div>
      </nav>

      {/* TABLE SECTION */}
      <main style={{ padding: isMobile ? '20px 10px' : '40px 60px', overflowX: 'auto' }}>
        <h1 style={{ color: '#001a35', marginBottom: '30px', fontWeight: '900' }}>INVENTORY MARKETPLACE</h1>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #001a35', textAlign: 'left' }}>
              <th style={thStyle}>PART NUMBER</th>
              <th style={thStyle}>DESCRIPTION</th>
              <th style={thStyle}>CONDITION</th>
              <th style={thStyle}>PRICE (INR)</th>
              <th style={thStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part) => (
              <tr key={part._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}><b>{part.partNumber}</b></td>
                <td style={tdStyle}>{part.description}</td>
                <td style={tdStyle}>{part.condition || 'NEW'}</td>
                <td style={tdStyle}>₹{part.price?.toLocaleString('en-IN') || 'Quote'}</td>
                <td style={tdStyle}>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Jedo%20Tech%20RFQ%0A---%0APN:%20${part.partNumber}%0ADesc:%20${part.description}%0AStatus:%20AOG%20Inquiry`}
                    target="_blank"
                    style={inquireButtonStyle}
                  >
                    INQUIRE
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredParts.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No matching parts found.</p>
        )}
      </main>
    </div>
  )
}

// STYLES
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#001a35' };
const searchBarStyle = { padding: '8px 15px', borderRadius: '4px', border: 'none', width: '250px', fontSize: '0.85rem' };
const thStyle = { padding: '15px 10px', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', letterSpacing: '1px' };
const tdStyle = { padding: '20px 10px', fontSize: '0.9rem', color: '#001a35' };
const inquireButtonStyle = { backgroundColor: '#ffb400', color: '#001a35', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.75rem' };