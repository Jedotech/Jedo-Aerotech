import { type SchemaTypeDefinition } from 'sanity'
import parts from './parts' // Fixed: Removed curly braces to match default export

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [parts], // This now correctly references the default export from parts.ts
}