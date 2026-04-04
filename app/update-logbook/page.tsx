'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  // Ensure this is an "Editor" token from manage.sanity.io
  token: 'YOUR_SANITY_WRITE_TOKEN_HERE', 
})

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [todaysActivity, setTodaysActivity] = useState('')
  const [accumulatedLandings, setAccumulatedLandings] = useState<number | null>(null)
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

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
          }
        } catch (err) {
          console.error("Searching...")
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
        setStatus('❌ REGISTRATION NOT FOUND')
        setLoading(false)
        return
      }

      const newTotal = (accumulatedLandings || 0) + Number(todaysActivity)
      
      // Update command
      await client.patch(docId).set({ currentLandings: newTotal }).commit()

      setStatus(`✅ SUCCESS: TOTAL IS ${newTotal}`)
      setAccumulatedLandings(newTotal)
      setTodaysActivity('')
      setComments('')
    } catch (err) {
      console.error(err)
      setStatus('❌ UPDATE FAILED: Check CORS/Token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <nav style={navWrapper}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '30px' }} />
        <Link href="/fleet-health" style={topRightLink}>VIEW LIVE FLEET STATUS</Link>
      </nav>

      <main style={cardFlexWrapper}>
        <div style={formCard}>
          <h2 style={titleStyle}>DAILY LOGBOOK ENTRY</h2>
          
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                    <label style={labelStyle}>CURRENT TOTAL</label>
                    <div style={readOnlyDisplay}>{accumulatedLandings ?? '--'}</div>
                </div>
                <div>
                    <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY'S ACTIVITY</label>
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
              <label style={labelStyle}>NEW CALCULATED TOTAL</label>
              <div style={{ ...readOnlyDisplay, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderStyle: 'solid' }}>
                {accumulatedLandings !== null && todaysActivity ? (accumulatedLandings + Number(todaysActivity)) : '--'}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>NOTES (OPTIONAL)</label>
                <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    style={{ ...inputStyle, minHeight: '45px', fontSize: '0.8rem' }}
                />
            </div>

            <button type="submit" disabled={loading || !todaysActivity} style={btnStyle}>
              {loading ? 'SYNCING...' : 'CONFIRM & UPDATE'}
            </button>
          </form>

          {status && <p style={statusStyle(status)}>{status}</p>}
        </div>
      </main>
    </div>
  )
}

// --- COMPACT STYLES ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617', fontFamily: 'Inter, sans-serif' };
const navWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', position: 'fixed', top: 0, width: '100%' };
const topRightLink: React.CSSProperties = { fontSize: '0.65rem', color: '#64748b', fontWeight: '800', textDecoration: 'none', letterSpacing: '0.5px' };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '10px' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', width: '100%', maxWidth: '400px' };
const titleStyle: React.CSSProperties = { color: '#001a35', fontWeight: '900', fontSize: '1rem', marginBottom: '15px', textAlign: 'center' };
const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '12px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.55rem', fontWeight: '900', color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' };
const readOnlyDisplay: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem', color: '#334155', border: '1.5px dashed #e2e8f0' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '10px', fontSize: '0.7rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#f43f5e', textAlign: 'center' });