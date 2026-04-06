import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from 'sanity/vision'
import { schemaTypes } from './schemas'
import React from 'react' // <--- ADD THIS LINE TO FIX THE SYNTAX ERROR

export default defineConfig({
  name: 'default',
  title: 'Jedo Admin',
  projectId: 'm2pa474h',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      layout: (props) => {
        return (
          React.createElement(React.Fragment, null, 
            React.createElement('style', null, `
                header[data-ui="AppBar"][data-state="published"],
                header[data-ui="AppBar"] {
                  background-color: #0b0f1a !important;
                  border-bottom: 1px solid #1e293b !important;
                }
                header[data-ui="AppBar"] h1, 
                header[data-ui="AppBar"] button,
                header[data-ui="AppBar"] span {
                  color: #f8fafc !important;
                }
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