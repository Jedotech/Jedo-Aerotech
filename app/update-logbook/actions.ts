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
 * to the historical Audit Log. Includes a safety check to initialize
 * the array if it is empty.
 */
export async function updateTyreLandings(
  tyreId: string, 
  newTotal: number, 
  landingsAdded: number, 
  logDate: string, 
  notes: string
) {
  try {
    // 1. Prepare the new log entry
    const newEntry = {
      _key: Math.random().toString(36).substring(2, 11), // Required unique key
      date: logDate,
      landingsAdded: Number(landingsAdded),
      notes: notes || 'Routine update'
    };

    // 2. Execute atomic patch with safety initialization
    await serverClient
      .patch(tyreId)
      .set({ currentLandings: newTotal }) // Update the master counter
      .setIfMissing({ auditLog: [] })     // CRITICAL: Ensure array exists first
      .insert('after', 'auditLog[-1]', [newEntry]) // Push to the end of the log
      .commit()

    return { success: true }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { success: false }
  }
}