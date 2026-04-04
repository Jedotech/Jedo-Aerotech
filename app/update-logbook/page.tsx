'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'next-sanity'
import Link from 'next/link'

const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, 
  token: 'YOUR_EDITOR_TOKEN_HERE', 
})

interface TyreAsset {
  _id: string;
  tyrePosition: string;
  currentLandings: number;
  manufacturer: string;
}

export default function UpdateLogbook() {
  const [tailNumber, setTailNumber] = useState('')
  const [foundTyres, setFoundTyres] = useState<TyreAsset[]>([])
  const [selectedTyre, setSelectedTyre] = useState<TyreAsset | null>(null)
  const [todaysActivity, setTodaysActivity] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. SEARCH FOR ALL TYRES ON THIS TAIL
  useEffect(() => {
    const fetchTyres = async () => {
      const cleanTail = tailNumber.trim().toUpperCase()
      if (cleanTail.length >= 4) {
        try {
          const data = await client.fetch(
            `*[_type == "fleetRecord" && tailNumber match $tail]{_id, tyrePosition, currentLandings, manufacturer}`, 
            { tail: cleanTail }
          )
          setFoundTyres(data || [])
          if (data.length > 0) setStatus(`${data.length} tyres identified.`)
          else setStatus('No tyres found for this tail.')
        } catch (err) { console.error("Syncing...") }
      } else {
        setFoundTyres([])
        setSelectedTyre(null)
      }
    }
    fetchTyres()
  }, [tailNumber])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTyre) return
    setLoading(true)

    try {
      const newTotal = selectedTyre.currentLandings + Number(todaysActivity)
      await client.patch(selectedTyre._id).set({ currentLandings: newTotal }).commit()

      setStatus(`✅ UPDATED: ${selectedTyre.tyrePosition} is now at ${newTotal}`)
      setTodaysActivity('')
      setTailNumber('')
      setSelectedTyre(null)
    } catch (err) {
      setStatus('❌ SYNC ERROR')
    } finally { setLoading(false) }
  }

  return (
    <div style={containerStyle}>
      <nav style={navWrapper}>
        <img src="/jedo-logo.png" alt="Jedo" style={{ height: '28px' }} />
        <Link href="/fleet-health" style={topRightLink}>VIEW LIVE FLEET STATUS</Link>
      </nav>

      <main style={cardFlexWrapper}>
        <div style={formCard}>
          <h2 style={titleStyle}>TYRE LOGBOOK ENTRY</h2>
          
          <form onSubmit={handleUpdate}>
            <div style={inputGroup}>
              <label style={labelStyle}>AIRCRAFT REGISTRATION</label>
              <input type="text" placeholder="e.g. VT-JEDO" value={tailNumber} onChange={(e) => setTailNumber(e.target.value)} style={inputStyle} required />
            </div>

            {/* 2. POSITION SELECTION (Only shows if tail matches) */}
            {foundTyres.length > 0 && (
              <div style={inputGroup}>
                <label style={labelStyle}>SELECT TYRE POSITION</label>
                <select 
                  style={inputStyle} 
                  onChange={(e) => {
                    const tyre = foundTyres.find(t => t._id === e.target.value)
                    setSelectedTyre(tyre || null)
                  }}
                  required
                >
                  <option value="">-- Choose Position --</option>
                  {foundTyres.map(tyre => (
                    <option key={tyre._id} value={tyre._id}>
                      {tyre.tyrePosition} ({tyre.manufacturer})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedTyre && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label style={labelStyle}>PREVIOUS TOTAL</label>
                        <div style={readOnlyDisplay}>{selectedTyre.currentLandings}</div>
                    </div>
                    <div>
                        <label style={{ ...labelStyle, color: '#ffb400' }}>TODAY'S ACTIVITY</label>
                        <input type="number" value={todaysActivity} onChange={(e) => setTodaysActivity(e.target.value)} style={{ ...inputStyle, borderColor: '#ffb400' }} required />
                    </div>
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>NEW TOTAL PREVIEW</label>
                  <div style={{ ...readOnlyDisplay, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderStyle: 'solid' }}>
                    {todaysActivity ? (selectedTyre.currentLandings + Number(todaysActivity)) : '--'}
                  </div>
                </div>

                <button type="submit" disabled={loading || !todaysActivity} style={btnStyle}>
                  {loading ? 'SYNCING...' : `UPDATE ${selectedTyre.tyrePosition.toUpperCase()}`}
                </button>
              </>
            )}
          </form>
          {status && <p style={statusStyle(status)}>{status}</p>}
        </div>
      </main>
    </div>
  )
}

// --- STYLES (MATCHING PREVIOUS COMPACT DESIGN) ---
const containerStyle: React.CSSProperties = { minHeight: '100vh', backgroundColor: '#020617', fontFamily: 'Inter, sans-serif' };
const navWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', position: 'fixed', top: 0, width: '100%' };
const topRightLink: React.CSSProperties = { fontSize: '0.65rem', color: '#64748b', fontWeight: '800', textDecoration: 'none' };
const cardFlexWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' };
const formCard: React.CSSProperties = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', width: '90%', maxWidth: '380px' };
const titleStyle: React.CSSProperties = { color: '#001a35', fontWeight: '900', fontSize: '0.9rem', marginBottom: '12px', textAlign: 'center' };
const inputGroup: React.CSSProperties = { textAlign: 'left', marginBottom: '10px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.55rem', fontWeight: '900', color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' };
const readOnlyDisplay: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', fontWeight: '800', fontSize: '0.85rem', color: '#334155', border: '1.5px dashed #e2e8f0' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#001a35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem' };
const statusStyle = (msg: string): React.CSSProperties => ({ marginTop: '8px', fontSize: '0.65rem', fontWeight: 'bold', color: msg.includes('✅') ? '#10b981' : '#f43f5e', textAlign: 'center' });