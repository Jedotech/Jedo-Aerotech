import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
name: 'default',
title: 'Jedo Admin',
projectId: 'm2pa474h',
dataset: 'production',
basePath: '/studio',
plugins: [
structureTool(),
],
schema: {
types: schema.types,
},
})