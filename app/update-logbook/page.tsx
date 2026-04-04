'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'

// SECURITY: In a real app, move this to an Environment Variable (.env.local)
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skntQeZWdkknIqB0zglGzPdwe1cigJdGhV6y5w1WlgbAwxw41w6QvMJ6blGZe6Sysu3HWmku7ZLH4386r3RvDs7UkO2Y27JBBy3tgBEIutN1bnAcbI9qXqoCnmlTOYkC0DrXvH4bwSik74MsXrbswqR7Frs6AhPfH4jqyKBh8eK08SGEI7ss', // Put your new token here
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
    } catch (err) {
      console.error(err)
      setStatus('❌ UPDATE FAILED. CHECK CONNECTION.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formCard}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '40px', marginBottom: '20px' }} />
        <h2 style={{ color: '#001a35', fontWeight: '900' }}>DAILY LOGBOOK ENTRY</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Input current total landings for synchronization.</p>
        
        <form onSubmit={handleUpdate} style={{ marginTop: '30px' }}>
          <label style={labelStyle}>TAIL NUMBER</label>
          <input 
            type="text" 
            placeholder="e.g. VT-JEDO" 
            value={tailNumber}
            onChange={(e) => setTailNumber(e.target.value)}
            style={inputStyle}
            required 
          />

          <label style={labelStyle}>TOTAL ACCUMULATED LANDINGS</label>
          <input 
            type="number" 
            placeholder="Check Aircraft Logbook" 
            value={newLandings}
            onChange={(e) => setNewLandings(e.target.value)}
            style={inputStyle}
            required 
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'PROCESSING...' : 'UPDATE JEDO INTEL'}
          </button>
        </form>

        {status && <p style={statusStyle(status)}>{status}</p>}
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
           <Link href="/fleet-health" style={{ fontSize: '0.8rem', color: '#001a35', fontWeight: 'bold', textDecoration: 'none' }}>
             ← VIEW LIVE FLEET DASHBOARD
           </Link>
        </div>
      </div>
    </div>
  )
}

// --- STYLES ---
const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9', padding: '20px' };
const formCard = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '450px', width: '100%', textAlign: 'center' as const };
const labelStyle = { display: 'block', textAlign: 'left' as const, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1.5px solid #eef2f6', marginBottom: '25px', fontSize: '1rem', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' };
const statusStyle = (msg: string) => ({ marginTop: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#ef4444' });