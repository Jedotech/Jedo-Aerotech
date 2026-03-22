import { defineField, defineType } from 'sanity'
import { RocketIcon, TrolleyIcon, InfoOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Tyre Inventory',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'technical', title: 'Technical Specs', icon: InfoOutlineIcon },
    { name: 'inventory', title: 'Warehouse & Sourcing', icon: TrolleyIcon },
    { name: 'management', title: 'Fleet Intel (Internal)' },
  ],
  fields: [
    // --- GROUP: TECHNICAL SPECS ---
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model',
      type: 'string',
      group: 'technical',
      options: { list: ['Cessna 172', 'Cessna 152', 'Piper Archer'] },
    }),
    defineField({
      name: 'gearPosition',
      title: 'Gear Position',
      type: 'string',
      group: 'technical',
      options: { list: ['Nose Gear', 'Main Gear', 'All Positions'] },
    }),
    defineField({
      name: 'tyreSize',
      title: 'Tyre Size',
      type: 'string',
      group: 'technical',
      description: 'Physical dimensions (e.g., 6.00-6)',
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number',
      type: 'string',
      group: 'technical',
      description: 'Manufacturer P/N (e.g., 505C61-8)',
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'string',
      group: 'technical',
      options: { list: ['4-Ply', '6-Ply', '8-Ply', '10-Ply'] },
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          { title: 'New / Factory Fresh', value: 'New' },
          { title: 'Serviceable / Tagged', value: 'Serviceable' },
        ],
      },
      initialValue: 'Serviceable',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'technical',
      description: 'e.g., Michelin Tyre, Flight Custom III',
    }),

    // --- GROUP: WAREHOUSE & SOURCING ---
    defineField({
      name: 'priceUSD',
      title: 'Price (USD)',
      type: 'number',
      group: 'inventory',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      group: 'inventory',
      initialValue: 1,
    }),
    defineField({
      name: 'warehouse',
      title: 'Warehouse Location',
      type: 'string',
      group: 'inventory',
      options: {
        list: ['Chennai', 'Singapore', 'USA', 'Dubai'],
      },
      initialValue: 'Singapore',
    }),

    // --- GROUP: MANAGEMENT (For Dashboard) ---
    defineField({
      name: 'ownerEmail',
      title: 'Assigned Customer Email',
      type: 'string',
      group: 'management',
    }),
    defineField({
      name: 'totalLandings',
      title: 'Current Landings',
      type: 'number',
      group: 'management',
      initialValue: 0,
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Landings)',
      type: 'number',
      group: 'management',
      initialValue: 350,
    }),
  ],
  preview: {
    select: {
      size: 'tyreSize',
      pn: 'partNumber',
      model: 'aircraftType',
    },
    prepare({ size, pn, model }) {
      return {
        title: `${size || 'New'} | ${pn || 'Entry'}`,
        subtitle: `For: ${model || 'Aircraft'}`,
      }
    },
  },
})