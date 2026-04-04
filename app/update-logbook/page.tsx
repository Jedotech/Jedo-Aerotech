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

  // 1. IMPROVED FETCHING (Handles Case Sensitivity)
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      if (tailNumber.trim().length >= 4) {
        try {
          const data = await client.fetch(
            `*[_type == "fleetRecord" && tailNumber match $tail][0].currentLandings`, 
            { tail: tailNumber.trim() }
          )
          if (data !== null && data !== undefined) {
            setAccumulatedLandings(data)
            setStatus('Aircraft recognized.')
          } else {
            setAccumulatedLandings(null)
            setStatus('❌ Aircraft not found.')
          }
        } catch (err) {
          setAccumulatedLandings(null)
        }
      } else {
        setAccumulatedLandings(null)
        setStatus('')
      }
    }
    fetchCurrentStatus()
  }, [tailNumber])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const query = `*[_type == "fleetRecord" && tailNumber match $tail][0]._id`
      const docId = await client.fetch(query, { tail: tailNumber.trim() })

      if (!docId) {
        setStatus('❌ Error: Could not verify airframe ID.')
        setLoading(false)
        return
      }

      const newTotal = (accumulatedLandings || 0) + Number(todaysActivity)

      await client.patch(docId).set({ currentLandings: newTotal }).commit()

      setStatus(`✅ SUCCESS: Total is now ${newTotal}`)
      setAccumulatedLandings(newTotal)
      setTodaysActivity('')
      setComments('')
    } catch (err) {
      setStatus('❌ Update failed. Check connection.')
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
        <div style={formCard}>
          <h2 style={{ color: '#001a35', fontWeight: '900', fontSize: '1.2rem', marginBottom: '5px' }}>DAILY LOGBOOK ENTRY</h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '20px' }}>Input today's activity for VT-JEDO Intel Sync.</p>
          
          <form onSubmit={handleUpdate}>
            <div style={inputGroup}>
              <label style={labelStyle}>REGISTRATION / TAIL NUMBER</label>
              <input 
                type="text" 
                placeholder="VT-JEDO" 
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
                        disabled={accumulatedLandings === null}
                        required 
                    />
                </div>
            </div>

            {/* NEW NON-EDITABLE FIELD FOR NEW TOTAL */}
            <div style={inputGroup}>
              <label style={labelStyle}>CALCULATED NEW TOTAL (AUTO-SYNC)</label>
              <div style={{ ...readOnlyDisplay, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                {accumulatedLandings !== null && todaysActivity ? (accumulatedLandings + Number(todaysActivity)) : '--'}
              </div>
            </div>

            <div style={inputGroup}>
                <label style={labelStyle}>MAINTENANCE NOTES (OPTIONAL)</label>
                <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    style={{ ...inputStyle, minHeight: '50px' }}
                    disabled={accumulatedLandings === null}
                />
            </div>

            <button type="submit" disabled={loading || !todaysActivity} style={btnStyle}>
              {loading ? 'SYNCING...' : 'CONFIRM & UPDATE'}
            </button>
          </form>

          {status && <p style={statusStyle(status)}>{status}</p>}
          
          <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
             <Link href="/fleet-health" style={{ fontSize: '0.7rem', color: '#001a35', fontWeight: '800', textDecoration: 'none' }}>
               VIEW LIVE FLEET STATUS
             </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- UPDATED STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#0f172a' }; // Darker Background
const logoNavStyle: React.CSSProperties = { padding: '20px 40px', position: 'fixed', top: 0, left: 0 };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxWidth: '440px', width: '100%' };
const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '15px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', marginBottom: '5px', letterSpacing: '0.5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const readOnlyDisplay: React.CSSProperties = { width: '100%', padding: '10px 15px', borderRadius: '8px', backgroundColor: '#f8fafc', fontWeight: '800', fontSize: '0.9rem', color: '#64748b', border: '1.5px dashed #e2e8f0' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '15px', fontSize: '0.75rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#ef4444' });