import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Aircraft Components',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'technical', title: 'Technical Specs' },
    { name: 'management', title: 'Customer & Status' },
    { name: 'inventory', title: 'Warehouse & Sourcing' },
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
        ],
      },
    }),
    defineField({
      name: 'gearPosition',
      title: 'Gear Position',
      type: 'string',
      group: 'technical',
      options: {
        list: ['Nose Gear', 'Main Gear', 'Tail Wheel'],
      },
    }),
    defineField({
      name: 'tyreSize',
      title: 'Tyre Size',
      type: 'string',
      group: 'technical',
      description: 'e.g., 5.00-5 or 6.00-6',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
      group: 'technical',
      description: 'The specific manufacturer part number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'number',
      group: 'technical',
      options: { list: [4, 6, 8, 10] },
      initialValue: 6,
    }),

    // --- MANAGEMENT & INVENTORY ---
    defineField({
      name: 'ownerEmail',
      title: 'Owner Email (for Intel Dashboard)',
      type: 'string',
      group: 'management',
    }),
    defineField({
      name: 'priceUSD',
      title: 'Unit Price (USD)',
      type: 'number',
      group: 'inventory',
    }),
    defineField({
      name: 'quantity',
      title: 'In-Stock Quantity',
      type: 'number',
      group: 'inventory',
    }),
    defineField({
      name: 'warehouse',
      title: 'Warehouse Location',
      type: 'string',
      group: 'inventory',
      options: { list: ['Chennai', 'Singapore', 'USA (Hub)'] },
    }),
  ],
  preview: {
    select: {
      title: 'tyreSize',
      subtitle: 'partNumber',
    },
  },
})