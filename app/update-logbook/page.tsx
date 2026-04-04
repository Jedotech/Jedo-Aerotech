'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'YOUR_SANITY_WRITE_TOKEN_HERE', 
})

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [todaysActivity, setTodaysActivity] = useState('')
  const [accumulatedLandings, setAccumulatedLandings] = useState<number | null>(null)
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. CLEANS INPUT & FETCHES DATA
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      const cleanTail = tailNumber.trim().toUpperCase()
      if (cleanTail.length >= 4) {
        try {
          const data = await client.fetch(
            `*[_type == "fleetRecord" && tailNumber match $tail][0].currentLandings`, 
            { tail: cleanTail }
          )
          if (data !== null && data !== undefined) {
            setAccumulatedLandings(data)
            setStatus('Airframe Verified.')
          } else {
            setAccumulatedLandings(null)
            setStatus('Searching for registration...')
          }
        } catch (err) {
          console.error("Fetch error")
        }
      }
    }
    fetchCurrentStatus()
  }, [tailNumber])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const cleanTail = tailNumber.trim().toUpperCase()

    try {
      const query = `*[_type == "fleetRecord" && tailNumber match $tail][0]._id`
      const docId = await client.fetch(query, { tail: cleanTail })

      if (!docId) {
        setStatus('❌ ERROR: Aircraft Registration Not Found.')
        setLoading(false)
        return
      }

      const newTotal = (accumulatedLandings || 0) + Number(todaysActivity)

      await client.patch(docId).set({ currentLandings: newTotal }).commit()

      setStatus(`✅ SYNCED: New Total is ${newTotal}`)
      setAccumulatedLandings(newTotal)
      setTodaysActivity('')
      setComments('')
    } catch (err) {
      setStatus('❌ UPDATE FAILED: Check Network/Token.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <nav style={logoNavStyle}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '35px' }} />
      </nav>

      <main style={cardFlexWrapper}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={formCard}>
            <h2 style={{ color: '#001a35', fontWeight: '900', fontSize: '1.2rem', marginBottom: '5px' }}>DAILY LOGBOOK ENTRY</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '20px' }}>Authenticate airframe for VT-JEDO Intel Sync.</p>
            
            <form onSubmit={handleUpdate}>
              <div style={inputGroup}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                      <label style={labelStyle}>PREVIOUS TOTAL</label>
                      <div style={readOnlyDisplay}>{accumulatedLandings ?? '--'}</div>
                  </div>
                  <div>
                      <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY'S LANDINGS</label>
                      <input 
                          type="number" 
                          value={todaysActivity}
                          onChange={(e) => setTodaysActivity(e.target.value)}
                          style={{ ...inputStyle, borderColor: '#ffb400' }}
                          required 
                      />
                  </div>
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>CALCULATED NEW TOTAL (AUTO-SYNC)</label>
                <div style={{ ...readOnlyDisplay, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderStyle: 'solid' }}>
                  {accumulatedLandings !== null && todaysActivity ? (accumulatedLandings + Number(todaysActivity)) : '--'}
                </div>
              </div>

              <div style={inputGroup}>
                  <label style={labelStyle}>MAINTENANCE NOTES (OPTIONAL)</label>
                  <textarea 
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      style={{ ...inputStyle, minHeight: '60px' }}
                  />
              </div>

              <button type="submit" disabled={loading || !todaysActivity} style={btnStyle}>
                {loading ? 'SYNCING...' : 'CONFIRM & UPDATE'}
              </button>
            </form>

            {status && <p style={statusStyle(status)}>{status}</p>}
          </div>

          {/* VIEW STATUS MOVED OUTSIDE & TO THE RIGHT */}
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
             <Link href="/fleet-health" style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', textDecoration: 'none' }}>
               VIEW LIVE FLEET STATUS →
             </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- UPDATED STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617' };
const logoNavStyle: React.CSSProperties = { padding: '30px 40px', position: 'fixed', top: 0, left: 0 };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '35px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)', width: '100%' };
const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '15px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none' };
const readOnlyDisplay: React.CSSProperties = { width: '100%', padding: '12px 15px', borderRadius: '10px', backgroundColor: '#f8fafc', fontWeight: '800', fontSize: '1rem', color: '#334155', border: '1.5px dashed #e2e8f0' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '15px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '15px', fontSize: '0.75rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#f43f5e' });