'use server'

import { createClient } from 'next-sanity'

const serverClient = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // 100% Secure on Server
})

export async function updateTyreLandings(tyreId: string, newTotal: number) {
  try {
    await serverClient.patch(tyreId).set({ currentLandings: newTotal }).commit()
    return { success: true }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { success: false }
  }
}