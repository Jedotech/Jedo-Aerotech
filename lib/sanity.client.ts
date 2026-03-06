import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'm2pa474h', //  actual Project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false to see updates immediately
})