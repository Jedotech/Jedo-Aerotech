'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'
import { updateTyreLandings } from './actions' 

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
  const [comments, setComments] = useState('') // New Comments State
  const [status, setStatus] = useState('Enter Tail Number...')
  const [loading, setLoading] = useState(false)

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

    const result = await updateTyreLandings(selectedTyre._id, newTotal)

    if (result.success) {
      setStatus(`✅ SUCCESS: ${newTotal} Landings Synced.`)
      setTodaysActivity(''); 
      setTailNumber(''); 
      setSelectedTyre(null); 
      setFoundTyres([]);
      setComments(''); // Clear comments on success
    } else {
      setStatus('❌ SYNC FAILED. Check Vercel Logs.')
    }
    setLoading(false)
  }

  return (
    <div style={containerStyle}>
      <nav style={navWrapper}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '32px' }} />
        {/* Added Highlight Color to Link */}
        <Link href="/fleet-health" style={topRightLink}>
          VIEW LIVE FLEET STATUS
        </Link>
      </nav>

      <main style={cardFlexWrapper}>
        <div style={formCard}>
          <h2 style={titleStyle}>SECURE LOGBOOK ENTRY</h2>
          
          <form onSubmit={handleUpdate}>
            <div style={inputGroup}>
              <label style={labelStyle}>AIRCRAFT REGISTRATION</label>
              <input type="text" placeholder="e.g. VT-JEDO" value={tailNumber} onChange={(e) => setTailNumber(e.target.value)} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>SELECT TYRE POSITION</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>PREVIOUS TOTAL</label>
                  <div style={readOnlyDisplay}>{selectedTyre?.currentLandings ?? '--'}</div>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY'S ACTIVITY</label>
                  <input type="number" placeholder="0" value={todaysActivity} onChange={(e) => setTodaysActivity(e.target.value)} style={{ ...inputStyle, borderColor: '#ffb400' }} required />
                </div>
            </div>

            {/* New Comments Field */}
            <div style={inputGroup}>
              <label style={labelStyle}>MAINTENANCE NOTES / COMMENTS (OPTIONAL)</label>
              <textarea 
                placeholder="e.g. Flight 102: Slight wear noticed on outer tread." 
                value={comments} 
                onChange={(e) => setComments(e.target.value)} 
                style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} 
              />
            </div>

            <button type="submit" disabled={loading || !selectedTyre} style={btnStyle}>
              {loading ? 'SYNCING TO CLOUD...' : 'UPDATE JEDO INTEL'}
            </button>
          </form>
          {status && <p style={statusStyle(status)}>{status}</p>}
        </div>
      </main>
    </div>
  )
}

// --- UPDATED STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617', fontFamily: 'Inter, sans-serif' };

const navWrapper: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '25px 50px', 
  position: 'fixed', 
  top: 0, 
  width: '100%' 
};

const topRightLink: React.CSSProperties = { 
  fontSize: '0.75rem', 
  color: '#ffb400', // Jedo Gold Highlight
  fontWeight: '900', 
  textDecoration: 'none',
  letterSpacing: '0.5px',
  border: '1px solid #ffb400',
  padding: '8px 16px',
  borderRadius: '6px'
};

const cardFlexWrapper: React.CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  minHeight: '100vh',
  padding: '100px 20px' 
};

const formCard: React.CSSProperties = { 
  backgroundColor: 'white', 
  padding: '40px', // Increased Padding
  borderRadius: '24px', 
  boxShadow: '0 30px 60px rgba(0,0,0,0.6)', 
  width: '100%', 
  maxWidth: '500px' // Increased Card Width
};

const titleStyle: React.CSSProperties = { 
  color: '#001a35', 
  fontWeight: '900', 
  fontSize: '1.4rem', // Increased Font Size
  marginBottom: '25px', 
  textAlign: 'center',
  letterSpacing: '-0.5px'
};

const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '20px' };

const labelStyle: React.CSSProperties = { 
  display: 'block', 
  fontSize: '0.65rem', 
  fontWeight: '900', 
  color: '#94a3b8', 
  marginBottom: '8px',
  letterSpacing: '1px'
};

const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '12px 16px', 
  borderRadius: '10px', 
  border: '1.5px solid #e2e8f0', 
  fontSize: '1rem', 
  outline: 'none',
  color: '#001a35'
};

const readOnlyDisplay: React.CSSProperties = { 
  width: '100%', 
  padding: '12px 16px', 
  borderRadius: '10px', 
  backgroundColor: '#f8fafc', 
  fontWeight: '800', 
  fontSize: '1.1rem', 
  color: '#334155', 
  border: '1.5px dashed #cbd5e1',
  textAlign: 'center'
};

const btnStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '16px', 
  backgroundColor: '#001a35', 
  color: 'white', 
  border: 'none', 
  borderRadius: '10px', 
  fontWeight: '900', 
  cursor: 'pointer', 
  fontSize: '0.9rem',
  marginTop: '10px',
  transition: 'transform 0.2s ease'
};

const statusStyle = (msg: string): React.CSSProperties => ({ 
  marginTop: '20px', 
  fontSize: '0.8rem', 
  fontWeight: 'bold', 
  color: msg.includes('✅') ? '#10b981' : '#f43f5e', 
  textAlign: 'center',
  backgroundColor: msg.includes('✅') ? '#ecfdf5' : '#fff1f2',
  padding: '10px',
  borderRadius: '8px'
});