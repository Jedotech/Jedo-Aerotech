import { defineField, defineType } from 'sanity'
import { RocketIcon, TrolleyIcon, InfoOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Aircraft Components',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'technical', title: 'Technical Specs', icon: InfoOutlineIcon },
    { name: 'inventory', title: 'Warehouse & Sourcing', icon: TrolleyIcon },
    { name: 'management', title: 'Fleet Intel (Internal)' },
  ],
  fields: [
    // --- TECHNICAL GROUP ---
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          { title: 'Cessna 172 Skyhawk', value: 'Cessna 172' },
          { title: 'Cessna 152', value: 'Cessna 152' },
          { title: 'Piper Archer', value: 'Piper Archer' },
          { title: 'Beechcraft Bonanza', value: 'Beechcraft' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gearPosition',
      title: 'Gear Position',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          { title: 'Nose Gear', value: 'Nose' },
          { title: 'Main Gear', value: 'Main' },
          { title: 'All Positions', value: 'All' },
        ],
        layout: 'radio',
      },
      initialValue: 'Main',
    }),
    defineField({
      name: 'tyreSize',
      title: 'Tyre Size',
      type: 'string',
      group: 'technical',
      description: 'Physical dimensions (e.g., 5.00-5)',
      options: {
        list: ['5.00-5', '6.00-6', '15x6.00-6', '7.00-6'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
      group: 'technical',
      description: 'Manufacturer Part Number (e.g., 066-5000-05)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'number',
      group: 'technical',
      options: {
        list: [4, 6, 8, 10],
      },
      initialValue: 6,
    }),

    // --- INVENTORY & SOURCING GROUP ---
    defineField({
      name: 'priceUSD',
      title: 'Unit Price (USD)',
      type: 'number',
      group: 'inventory',
      description: 'Base price before customs/GST. Dashboard will convert this to INR.',
    }),
    defineField({
      name: 'quantity',
      title: 'In-Stock Quantity',
      type: 'number',
      group: 'inventory',
      initialValue: 1,
    }),
    defineField({
      name: 'warehouse',
      title: 'Sourcing Hub / Warehouse',
      type: 'string',
      group: 'inventory',
      options: {
        list: ['Chennai', 'Singapore', 'USA', 'Dubai'],
      },
      initialValue: 'Chennai',
    }),

    // --- MANAGEMENT GROUP (For Fleet Intel App) ---
    defineField({
      name: 'ownerEmail',
      title: 'Assigned Customer Email',
      type: 'string',
      group: 'management',
      description: 'Email used to filter this asset on the Fleet Intel Dashboard.',
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
        title: `${size} | ${pn}`,
        subtitle: `For: ${model}`,
      }
    },
  },
})