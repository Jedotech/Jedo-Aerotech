import parts from './parts'           // Matches your 'parts.ts' file
import fleetRecord from './fleetRecord' // Matches your 'fleetRecord.tsx' file
import client from './client'
import purchase from './purchase'
import fleetUser from './fleetUser'     // ADDED: For unique user access codes

/**
 * The Master Schema List for Jedo Admin
 * Consolidating Inventory and Fleet Intelligence
 */
export const schemaTypes = [
  parts, 
  fleetRecord, 
  client, 
  purchase,
  fleetUser // ADDED: Registering the User schema
]