import parts from './parts'           
import fleetRecord from './fleetRecord' 
import client from './client'
import purchase from './purchase'
import fleetUser from './fleetUser'     

/**
 * The Master Schema List for Jedo Admin
 * Consolidating Inventory and Fleet Intelligence
 * * Note: fleetRecord now includes the 'schoolName' field for 
 * FLY HIGH SCHOOL and other multi-tenant operators.
 */
export const schemaTypes = [
  parts, 
  fleetRecord, 
  client, 
  purchase,
  fleetUser 
]

// Default export for the Sanity Config
export const schema = {
  types: schemaTypes,
}