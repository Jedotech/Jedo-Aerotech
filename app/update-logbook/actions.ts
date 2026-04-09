'use server'

import { createClient } from 'next-sanity'

const serverClient = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // 100% Secure on Server
})

/**
 * Updates the accumulated landings and appends a structured entry 
 * to the historical Audit Log.
 */
export async function updateTyreLandings(
  tyreId: string, 
  newTotal: number, 
  landingsAdded: number, 
  logDate: string, 
  notes: string
) {
  try {
    await serverClient
      .patch(tyreId)
      .set({ currentLandings: newTotal }) // Updates the main counter
      .insert('after', 'auditLog[-1]', [{ // Appends new object to the history array
        _key: Math.random().toString(36).substring(2, 11), // Required unique key for Sanity arrays
        date: logDate,
        landingsAdded: Number(landingsAdded),
        notes: notes || 'Routine update'
      }])
      .commit()

    return { success: true }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { success: false }
  }
}