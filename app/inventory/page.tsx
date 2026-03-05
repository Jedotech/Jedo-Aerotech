'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from 'next-sanity';

// 1. Configure the Sanity Client
const client = createClient({
  projectId: "m2pa474h",
  dataset: "production",
  apiVersion: "2024-03-05",
  useCdn: false,
});

export default function InventoryPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 2. Fetch data when the page loads
  useEffect(() => {
    const fetchParts = async () => {
      const query = `*[_type == "part"] | order(_createdAt desc) {
        _id,
        partNumber,
        aircraftType,
        condition,
        location
      }`;
      const data = await client.fetch(query);
      setParts(data);
      setLoading(false);
    };
    fetchParts();
  }, []);

  // 3. Filter logic
  const filteredParts = parts.filter((part) =>
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.aircraftType && part.aircraftType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVIGATION */}
      <nav style={navStyle}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>JEDO <span style={{ color: '#ffb400' }}>TECH</span></div>
        </Link>
        <Link href="/#rfq" style={quoteButtonStyle}>REQUEST QUOTE</Link>
      </nav>

      {/* HEADER & SEARCH BAR */}
      <header style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <h1 style={{ color: '#002d5b', fontSize: '2.5rem', marginBottom: '20px' }}>Current Inventory</h1>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="🔍 Search by Part Number or Aircraft (e.g. Cessna)..." 
            style={searchBarStyle}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* TABLE SECTION */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <div style={tableContainerStyle}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Fleet Inventory...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#002d5b', color: 'white' }}>
                  <th style={tableHeader}>Part Number</th>
                  <th style={tableHeader}>Compatibility</th>
                  <th style={tableHeader}>Condition</th>
                  <th style={tableHeader}>Location</th>
                  <th style={tableHeader}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part) => (
                  <tr key={part._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={tableCell}><strong>{part.partNumber}</strong></td>
                    <td style={tableCell}>{part.aircraftType || "General Aviation"}</td>
                    <td style={tableCell}>
                      <span style={{ 
                        backgroundColor: part.condition === 'NE' ? '#dcfce7' : '#fef9c3', 
                        color: part.condition === 'NE' ? '#166534' : '#854d0e', 
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
                      }}>
                        {part.condition}
                      </span>
                    </td>
                    <td style={tableCell}>{part.location}</td>
                    <td style={tableCell}>
                      <Link href="/#rfq" style={rfqLinkStyle}>RFQ →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredParts.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No parts found matching "{searchTerm}". Try a different part number.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// STYLING
const navStyle = { backgroundColor: '#002d5b', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' };
const quoteButtonStyle = { backgroundColor: '#ffb400', color: '#002d5b', padding: '8px 18px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' as const };
const searchBarStyle = { width: '100%', padding: '15px 25px', borderRadius: '30px', border: '2px solid #002d5b', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const tableContainerStyle = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' as const };
const tableHeader = { padding: '20px', fontSize: '0.85rem', fontWeight: 'bold' as const, textTransform: 'uppercase' as const };
const tableCell = { padding: '18px 20px', fontSize: '0.95rem' };
const rfqLinkStyle = { backgroundColor: '#002d5b', color: 'white', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' };