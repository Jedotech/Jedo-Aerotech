import parts from './parts'           // Matches your 'parts.ts' file
import fleetRecord from './fleetRecord' // Matches your 'fleetRecord.tsx' file
import client from './client'
import purchase from './purchase'

/**
 * The Master Schema List for Jedo Admin
 * Consolidating Inventory and Fleet Intelligence
 */
export const schemaTypes = [
  parts, 
  fleetRecord, 
  client, 
  purchase
]