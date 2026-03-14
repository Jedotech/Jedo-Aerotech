import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
// Ensure this path matches where your schema/index.ts is located
import { schema } from './src/sanity/schemaTypes' 

export default defineConfig({
  name: 'default',
  title: 'Jedo Admin',

  projectId: 'm2pa474h',
  dataset: 'production',
  
  // This allows you to access the studio at jedotech.com/studio
  basePath: '/studio', 

  plugins: [
    structureTool(),
  ],

  schema: {
    // If your schema object has a 'types' property, this is correct
    types: schema.types, 
  },
})