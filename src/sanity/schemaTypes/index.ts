import { type SchemaTypeDefinition } from 'sanity'
import { parts } from './parts' // Import the file you just edited

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [parts], // Add it to the array
}