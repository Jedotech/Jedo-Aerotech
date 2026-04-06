import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from 'sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Jedo Admin',
  projectId: 'm2pa474h',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  /* --- ADD THIS STUDIO COMPONENT BLOCK --- */
  studio: {
    components: {
      layout: (props) => {
        return (
          <>
            <style>
              {`
                /* 1. Kill the Green Ribbon on Published Documents */
                header[data-ui="AppBar"][data-state="published"],
                header[data-ui="AppBar"] {
                  background-color: #0b0f1a !important; /* Your Deep Body Blue/Black */
                  border-bottom: 1px solid #1e293b !important;
                }

                /* 2. Ensure text and buttons in the header stay crisp white/cyan */
                header[data-ui="AppBar"] h1, 
                header[data-ui="AppBar"] button,
                header[data-ui="AppBar"] span {
                  color: #f8fafc !important;
                }

                /* 3. Keep the subtle status dots blue/cyan instead of green if preferred */
                [data-testid="status-dot"][data-state="published"] {
                  background-color: #3b82f6 !important; 
                }
              `}
            </style>
            {props.renderDefault(props)}
          </>
        )
      }
    }
  }
})