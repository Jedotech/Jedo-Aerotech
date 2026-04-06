import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from 'sanity/vision'
import React from 'react'

// --- CORRECTED IMPORT PATH ---
// Points specifically to your src/sanity/schemaTypes folder
import { schemaTypes } from './src/sanity/schemaTypes' 

export default defineConfig({
  name: 'default',
  title: 'Jedo Admin',
  projectId: 'm2pa474h',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  /* --- PROFESSIONAL UI OVERRIDE: LOCK DARK THEME --- */
  studio: {
    components: {
      layout: (props) => {
        return (
          React.createElement(React.Fragment, null, 
            React.createElement('style', null, `
                /* Lock the top ribbon to your Professional Dark Blue-Black */
                header[data-ui="AppBar"] {
                  background-color: #0b0f1a !important;
                  border-bottom: 1px solid #1e293b !important;
                }
                
                /* Ensure navbar text and buttons remain clearly visible */
                header[data-ui="AppBar"] h1, 
                header[data-ui="AppBar"] button,
                header[data-ui="AppBar"] span {
                  color: #f8fafc !important;
                }

                /* Standardize the Published Dot to Blue to match Jedo brand */
                [data-testid="status-dot"][data-state="published"] {
                  background-color: #3b82f6 !important; 
                }
            `),
            props.renderDefault(props)
          )
        )
      }
    }
  }
})