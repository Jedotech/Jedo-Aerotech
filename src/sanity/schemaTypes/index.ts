import aircraft from './aircraft' // 1. Import first
import parts from './parts'           
import fleetRecord from './fleetRecord' 
import client from './client'
import purchase from './purchase'
import fleetUser from './fleetUser'     

export const schemaTypes = [
  aircraft,    // 2. Register first
  parts, 
  fleetRecord, 
  client, 
  purchase,
  fleetUser
]

export const schema = {
  types: schemaTypes,
} 