'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

// 1. PROJECT CREDENTIALS & WRITE TOKEN
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  // SECURITY: Replace with your actual Write Token from manage.sanity.io
  token: 'YOUR_SANITY_WRITE_TOKEN_HERE', 
})

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [todaysActivity, setTodaysActivity] = useState('')
  const [accumulatedLandings, setAccumulatedLandings] = useState<number | null>(null)
  const [comments, setComments] = useState('')
  
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // 2. LIVE FETCH FUNCTION (As soon as Tail is recognized)
  useEffect(() => {
    if (tailNumber.length > 4) { // Basic VT-JEDO length check
      setFetching(true)
      setStatus('Fetching current airframe status...')
      
      client.fetch(`*[_type == "fleetRecord" && tailNumber == $tail][0].currentLandings`, { 
        tail: tailNumber.toUpperCase() 
      })
      .then(data => {
        setAccumulatedLandings(data ?? 0)
        setStatus('Ready for logbook update.')
      })
      .catch(() => {
        setStatus('❌ AIRCRAFT NOT FOUND. CHECK TAIL.')
        setAccumulatedLandings(null)
      })
      .finally(() => setFetching(false))
    } else {
        setAccumulatedLandings(null)
    }
  }, [tailNumber])

  // 3. LOGIC FOR INCREMENTAL UPDATE
  const handleIncrementalUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('VALIDATING & SYNCING LOGBOOK...')

    const activityNumber = Number(todaysActivity)
    if (activityNumber <= 0 || !accumulatedLandings === null) {
      setStatus('❌ Enter valid positive activity number.')
      setLoading(false)
      return
    }

    try {
      // Find the document ID
      const query = `*[_type == "fleetRecord" && tailNumber == $tail][0]._id`
      const docId = await client.fetch(query, { tail: tailNumber.toUpperCase() })

      if (!docId) {
        setStatus('❌ AIRCRAFT NOT FOUND IN DATABASE')
        setLoading(false)
        return
      }

      // Calculate the new TOTAL and Append Comment
      const newTotal = (accumulatedLandings || 0) + activityNumber
      // Simple log entry style: [Date] Notes
      const newCommentLog = comments ? `[${new Date().toLocaleDateString()}] ${comments}` : ''

      // 4. PATCH SANITY WITH NEW TOTAL (Keep comments separate or ignore if not in schema)
      await client
        .patch(docId)
        .set({ currentLandings: newTotal })
        // If you add a "maintenanceLog" string field in schema, you can enable this:
        // .append({ maintenanceLog: [newCommentLog] }) 
        .commit()

      setStatus(`✅ SUCCESS! New Total: ${newTotal}. Syncing Dashboard...`)
      setTodaysActivity('')
      setComments('')
      // Refresh local display value
      setAccumulatedLandings(newTotal)

    } catch (err) {
      console.error(err)
      setStatus('❌ UPDATE FAILED. CHECK TOKEN OR SCHEMA.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Updated Background Color to distinguish the page
    <div style={containerStyle}>
      
      {/* 5. LOGO MOVED TO TOP LEFT (Homepage size) */}
      <nav style={logoNavStyle}>
        <img src="/jedo-logo.png" alt="Jedo Technologies" style={{ height: '35px' }} />
      </nav>

      <main style={cardFlexWrapper}>
        <div style={formCard}>
          <h2 style={{ color: '#001a35', fontWeight: '900', fontSize: '1.4rem' }}>DAILY LOGBOOK ENTRY</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Authenticate airframe and input today's activity.</p>
          
          <form onSubmit={handleIncrementalUpdate} style={{ marginTop: '30px' }}>
            
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

            {/* 6. READ-ONLY PREVIOUS TOTAL (Autofilled on Tail Match) */}
            <div style={{ textAlign: 'left', marginBottom: '25px', opacity: accumulatedLandings === null ? 0.3 : 1 }}>
                <label style={labelStyle}>ACCUMULATED AIRFRAME LANDINGS (READ-ONLY)</label>
                <div style={readOnlyDisplay}>
                    {fetching ? 'FETCHING...' : accumulatedLandings ?? 'Enter Valid Tail'}
                </div>
            </div>

            {/* 7. ACTIVITY-ONLY INPUT */}
            <div style={{ textAlign: 'left', marginBottom: '25px', opacity: accumulatedLandings === null ? 0.3 : 1 }}>
              <label style={{ ...labelStyle, color: '#ffb400' }}>LANDINGS CONDUCTED TODAY</label>
              <input 
                type="number" 
                placeholder="e.g. 15 (Added to total)" 
                value={todaysActivity}
                onChange={(e) => setTodaysActivity(e.target.value)}
                style={{ ...inputStyle, borderColor: '#ffb400', borderStyle: 'solid' }}
                required 
                disabled={accumulatedLandings === null}
              />
            </div>

            {/* 8. OPTIONAL COMMENTS SECTION */}
            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                <label style={labelStyle}>JOURNEY LOG / MAINTENANCE NOTES (OPTIONAL)</label>
                <textarea 
                    placeholder="e.g. Flight 14 pilot noted slight vibration on right main gear."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    style={{ ...inputStyle, minHeight: '80px', fontFamily: 'Inter, sans-serif' }}
                    disabled={accumulatedLandings === null}
                />
            </div>

            <button type="submit" disabled={loading || accumulatedLandings === null} style={btnStyle}>
              {loading ? 'SYNCING...' : 'UPDATE JEDO INTEL'}
            </button>
          </form>

          {status && <p style={statusStyle(status)}>{status}</p>}
          
          <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
             {/* 9. REMOVED ARROW, ADDED LINK TEXT */}
             <Link href="/fleet-health" style={{ fontSize: '0.75rem', color: '#001a35', fontWeight: '800', textDecoration: 'none' }}>
               VIEW LIVE FLEET STATUS
             </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- CSS-IN-JS STYLES (Adjusted for requirements) ---
// Distinguishes the main page background
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#e2e8f0' }; 
// Logo nav like homepage
const logoNavStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-start', padding: '20px 40px', position: 'fixed', top: 0, left: 0, width: '100%' };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '100px 20px 20px' };
// Distinct form card background
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '480px', width: '100%', textAlign: 'center' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', letterSpacing: '1px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', border: '1.5px solid #eef2f6', fontSize: '1rem', outline: 'none' };
// For read-only number display
const readOnlyDisplay: React.CSSProperties = { ...inputStyle, backgroundColor: '#f8fafc', fontWeight: '900', color: '#001a35', borderStyle: 'dotted' }; 
const btnStyle: React.CSSProperties = { width: '100%', padding: '15px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : (msg.includes('Fetching') ? '#64748b' : '#ef4444') });