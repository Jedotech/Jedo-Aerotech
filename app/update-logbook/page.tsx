'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'
import { updateTyreLandings } from './actions' // Import the secure server-side function

// This client is for READING only - no token required here
const readClient = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [foundTyres, setFoundTyres] = useState<any[]>([])
  const [selectedTyre, setSelectedTyre] = useState<any>(null)
  const [todaysActivity, setTodaysActivity] = useState('')
  const [status, setStatus] = useState('Enter Tail Number...')
  const [loading, setLoading] = useState(false)

  // 1. Fetch tyres based on Tail Number
  useEffect(() => {
    const fetchTyres = async () => {
      const cleanTail = tailNumber.trim().toUpperCase()
      if (cleanTail.length >= 4) {
        try {
          const data = await readClient.fetch(
            `*[_type == "fleetRecord" && tailNumber == $tail]{_id, tyrePosition, currentLandings}`, 
            { tail: cleanTail }
          )
          setFoundTyres(data || [])
          setStatus(data.length > 0 ? 'Select Position' : '❌ No tyres found.')
        } catch (err) { setStatus('Connection Error') }
      }
    }
    fetchTyres()
  }, [tailNumber])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTyre) return
    setLoading(true)
    setStatus('Syncing securely...')

    const newTotal = (selectedTyre.currentLandings || 0) + Number(todaysActivity)

    // 2. Call the Secure Server Action
    const result = await updateTyreLandings(selectedTyre._id, newTotal)

    if (result.success) {
      setStatus(`✅ SUCCESS: ${newTotal} Landings Synced.`)
      setTodaysActivity(''); setTailNumber(''); setSelectedTyre(null); setFoundTyres([]);
    } else {
      setStatus('❌ SYNC FAILED. Check Vercel Logs.')
    }
    setLoading(false)
  }

  return (
    <div style={containerStyle}>
      <nav style={navWrapper}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '26px' }} />
        <Link href="/fleet-health" style={topRightLink}>VIEW LIVE FLEET STATUS</Link>
      </nav>

      <main style={cardFlexWrapper}>
        <div style={formCard}>
          <h2 style={titleStyle}>SECURE LOGBOOK ENTRY</h2>
          
          <form onSubmit={handleUpdate}>
            <div style={inputGroup}>
              <label style={labelStyle}>REGISTRATION</label>
              <input type="text" placeholder="VT-JEDO" value={tailNumber} onChange={(e) => setTailNumber(e.target.value)} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>SELECT POSITION</label>
              <select 
                style={inputStyle} 
                onChange={(e) => setSelectedTyre(foundTyres.find(t => t._id === e.target.value))} 
                required
                disabled={foundTyres.length === 0}
              >
                <option value="">{foundTyres.length > 0 ? '-- Choose Position --' : 'Waiting for Tail...'}</option>
                {foundTyres.map(t => <option key={t._id} value={t._id}>{t.tyrePosition}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={labelStyle}>PREVIOUS</label>
                  <div style={readOnlyDisplay}>{selectedTyre?.currentLandings ?? '--'}</div>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY</label>
                  <input type="number" value={todaysActivity} onChange={(e) => setTodaysActivity(e.target.value)} style={{ ...inputStyle, borderColor: '#ffb400' }} required />
                </div>
            </div>

            <button type="submit" disabled={loading || !selectedTyre} style={btnStyle}>
              {loading ? 'SYNCING...' : 'UPDATE JEDO INTEL'}
            </button>
          </form>
          {status && <p style={statusStyle(status)}>{status}</p>}
        </div>
      </main>
    </div>
  )
}

// --- STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617', fontFamily: 'Inter, sans-serif' };
const navWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', position: 'fixed', top: 0, width: '100%' };
const topRightLink: React.CSSProperties = { fontSize: '0.65rem', color: '#64748b', fontWeight: '800', textDecoration: 'none' };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)', width: '90%', maxWidth: '350px' };
const titleStyle: React.CSSProperties = { color: '#001a35', fontWeight: '900', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center' };
const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '8px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.5rem', fontWeight: '900', color: '#94a3b8', marginBottom: '3px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '0.8rem' };
const readOnlyDisplay: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: '6px', backgroundColor: '#f8fafc', fontWeight: '800', fontSize: '0.8rem', color: '#334155', border: '1.5px dashed #e2e8f0' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '10px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '0.75rem' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '8px', fontSize: '0.65rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#f43f5e', textAlign: 'center' });