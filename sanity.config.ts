import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
name: 'default',
title: 'Jedo Aerotech Admin',
projectId: 'm2pa474h',
dataset: 'production',
basePath: '/studio',
plugins: [
structureTool(),
visionTool(),
],
schema: {
types: schema.types,
},
})