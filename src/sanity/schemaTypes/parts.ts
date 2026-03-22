import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Tyre Inventory',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model',
      type: 'string',
      options: {
        list: ['Cessna 172', 'Cessna 152', 'Piper Archer'],
      },
    }),
    defineField({
      name: 'gearPosition',
      title: 'Gear Position',
      type: 'string',
      options: {
        list: ['Nose Gear', 'Main Gear', 'All Positions'],
      },
    }),
    // --- THIS IS THE CRITICAL CHANGE: TWO SEPARATE FIELDS ---
    defineField({
      name: 'tyreSize', // Separate Field 1
      title: 'Tyre Size',
      type: 'string',
      description: 'e.g., 6.00-6 or 5.00-5',
    }),
    defineField({
      name: 'partNumber', // Separate Field 2
      title: 'Part Number',
      type: 'string',
      description: 'The specific manufacturer P/N (e.g., 505C61-8)',
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'string',
      options: {
        list: ['4-Ply', '6-Ply', '8-Ply', '10-Ply'],
      },
    }),
    // ... price and warehouse fields below
  ],
})