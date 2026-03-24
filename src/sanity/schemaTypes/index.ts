import { type SchemaTypeDefinition } from 'sanity'
import part from './part'
import fleet from './fleet' 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // This allows both document types to live in the 'production' dataset
    part,   // Manages the Tyre Marketplace (Aircraft Model, PN, Price, etc.)
    fleet,  // Manages Fleet Health (Landings, Design Life, Owner Email)
  ],
}