'use client'

import { useState } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link' // <--- THIS WAS THE MISSING LINE CAUSING THE BUILD ERROR

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  // Ensure you have pasted your actual Write Token here
  token: 'skntQeZWdkknIqB0zglGzPdwe1cigJdGhV6y5w1WlgbAwxw41w6QvMJ6blGZe6Sysu3HWmku7ZLH4386r3RvDs7UkO2Y27JBBy3tgBEIutN1bnAcbI9qXqoCnmlTOYkC0DrXvH4bwSik74MsXrbswqR7Frs6AhPfH4jqyKBh8eK08SGEI7ss', 
})

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [newLandings, setNewLandings] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('SYNCING WITH JEDO INTEL...')

    try {
      // 1. Find the document ID for that Tail Number
      const query = `*[_type == "fleetRecord" && tailNumber == $tail][0]._id`
      const docId = await client.fetch(query, { tail: tailNumber.toUpperCase() })

      if (!docId) {
        setStatus('❌ AIRCRAFT NOT FOUND')
        setLoading(false)
        return
      }

      // 2. Patch the new landing count
      await client
        .patch(docId)
        .set({ currentLandings: Number(newLandings) })
        .commit()

      setStatus('✅ LOGBOOK UPDATED SUCCESSFULLY!')
      setNewLandings('')
      setTailNumber('')
    } catch (err) {
      console.error(err)
      setStatus('❌ UPDATE FAILED. CHECK TOKEN PERMISSIONS.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formCard}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px', marginBottom: '20px' }} />
        <h2 style={{ color: '#001a35', fontWeight: '900', fontSize: '1.4rem' }}>DAILY LOGBOOK ENTRY</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Sync current total landings with Jedo Fleet Intelligence.</p>
        
        <form onSubmit={handleUpdate} style={{ marginTop: '30px' }}>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={labelStyle}>REGISTRATION / TAIL NUMBER</label>
            <input 
              type="text" 
              placeholder="e.g. VT-JEDO" 
              value={tailNumber}
              onChange={(e) => setTailNumber(e.target.value)}
              style={inputStyle}
              required 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '25px' }}>
            <label style={labelStyle}>TOTAL ACCUMULATED LANDINGS</label>
            <input 
              type="number" 
              placeholder="Enter current total" 
              value={newLandings}
              onChange={(e) => setNewLandings(e.target.value)}
              style={inputStyle}
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'PROCESSING...' : 'UPDATE JEDO INTEL'}
          </button>
        </form>

        {status && <p style={statusStyle(status)}>{status}</p>}
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
           <Link href="/fleet-health" style={{ fontSize: '0.75rem', color: '#001a35', fontWeight: '800', textDecoration: 'none' }}>
             ← VIEW LIVE FLEET STATUS
           </Link>
        </div>
      </div>
    </div>
  )
}

// --- CSS-IN-JS STYLES ---
const containerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9', padding: '20px' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '450px', width: '100%', textAlign: 'center' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', border: '1.5px solid #eef2f6', fontSize: '1rem', outline: 'none' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '15px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#ef4444' });