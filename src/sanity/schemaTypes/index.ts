import { type SchemaTypeDefinition } from 'sanity'
import part from './parts' // Added the 's' to match your filename parts.ts
import fleet from './fleet' 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [part, fleet],
}