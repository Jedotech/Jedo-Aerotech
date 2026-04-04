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
  const [comments, setComments] = useState('') 
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
      setComments(''); 
    } else {
      setStatus('❌ SYNC FAILED. Check Vercel Logs.')
    }
    setLoading(false)
  }

  return (
    <div style={containerStyle}>
      <nav style={navWrapper}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '28px' }} />
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelStyle}>PREVIOUS TOTAL</label>
                  <div style={readOnlyDisplay}>{selectedTyre?.currentLandings ?? '--'}</div>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY'S ACTIVITY</label>
                  <input type="number" placeholder="0" value={todaysActivity} onChange={(e) => setTodaysActivity(e.target.value)} style={{ ...inputStyle, borderColor: '#ffb400' }} required />
                </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>COMMENTS (OPTIONAL)</label>
              <textarea 
                placeholder="Brief maintenance notes..." 
                value={comments} 
                onChange={(e) => setComments(e.target.value)} 
                style={{ ...inputStyle, minHeight: '45px', fontSize: '0.85rem' }} 
              />
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

// --- COMPACT STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617', fontFamily: 'Inter, sans-serif', overflow: 'hidden' };

const navWrapper: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '15px 30px', 
  position: 'fixed', 
  top: 0, 
  width: '100%' 
};

const topRightLink: React.CSSProperties = { 
  fontSize: '0.65rem', 
  color: '#ffb400', 
  fontWeight: '900', 
  textDecoration: 'none',
  border: '1px solid #ffb400',
  padding: '6px 12px',
  borderRadius: '4px'
};

const cardFlexWrapper: React.CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  minHeight: '100vh',
  padding: '20px' 
};

const formCard: React.CSSProperties = { 
  backgroundColor: 'white', 
  padding: '25px', 
  borderRadius: '16px', 
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)', 
  width: '100%', 
  maxWidth: '420px' 
};

const titleStyle: React.CSSProperties = { 
  color: '#001a35', 
  fontWeight: '900', 
  fontSize: '1rem', 
  marginBottom: '15px', 
  textAlign: 'center'
};

const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '12px' };

const labelStyle: React.CSSProperties = { 
  display: 'block', 
  fontSize: '0.55rem', 
  fontWeight: '900', 
  color: '#94a3b8', 
  marginBottom: '4px',
  letterSpacing: '0.5px'
};

const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '8px 12px', 
  borderRadius: '8px', 
  border: '1.5px solid #e2e8f0', 
  fontSize: '0.85rem', 
  outline: 'none',
  color: '#001a35'
};

const readOnlyDisplay: React.CSSProperties = { 
  width: '100%', 
  padding: '8px 12px', 
  borderRadius: '8px', 
  backgroundColor: '#f8fafc', 
  fontWeight: '800', 
  fontSize: '0.9rem', 
  color: '#334155', 
  border: '1.5px dashed #cbd5e1',
  textAlign: 'center'
};

const btnStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '12px', 
  backgroundColor: '#001a35', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: '900', 
  cursor: 'pointer', 
  fontSize: '0.8rem',
  marginTop: '5px'
};

const statusStyle = (msg: string): React.CSSProperties => ({ 
  marginTop: '12px', 
  fontSize: '0.7rem', 
  fontWeight: 'bold', 
  color: msg.includes('✅') ? '#10b981' : '#f43f5e', 
  textAlign: 'center',
  padding: '6px',
  borderRadius: '6px',
  backgroundColor: msg.includes('✅') ? '#ecfdf5' : 'transparent'
});