import { defineType, defineField } from 'sanity'

export const parts = defineType({
  name: 'part', 
  title: 'Tyre Inventory',
  type: 'document',
  fields: [
    defineField({
      name: 'partNumber',
      title: 'Part Number / Tyre Size',
      type: 'string',
      description: 'e.g., 6.00-6 or 5.00-5',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'string',
      description: 'The load-carrying capacity of the tyre.',
      options: {
        list: [
          { title: '4-Ply', value: '4-Ply' },
          { title: '6-Ply', value: '6-Ply' },
          { title: '8-Ply', value: '8-Ply' },
          { title: '10-Ply', value: '10-Ply' },
          { title: '12-Ply', value: '12-Ply' },
        ],
      },
    }),
    defineField({
      name: 'priceUSD',
      title: 'Base Price (USD)',
      type: 'number',
      description: 'Global sourcing price. Automatically converted to INR on the site.',
    }),
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Compatibility',
      type: 'string',
      description: 'Primary aircraft model, e.g., Cessna 172.',
      initialValue: 'Cessna 172',
    }),
    defineField({
      name: 'quantity',
      title: 'Availability Status',
      type: 'number',
      description: 'Set to 0 for "Available to Source" or 1+ for "Ready Hub".',
      initialValue: 0,
    }),
    defineField({
      name: 'warehouse',
      title: 'Warehouse Hub',
      type: 'string',
      options: {
        list: [
          { title: 'Chennai, India (24-48h)', value: 'Chennai' },
          { title: 'Singapore Hub (3-5 Days)', value: 'Singapore' },
          { title: 'USA Warehouse (7-10 Days)', value: 'USA' },
        ],
      },
      initialValue: 'Chennai',
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          { title: 'New (NE)', value: 'New' },
          { title: 'New Surplus (NS)', value: 'New Surplus' },
          { title: 'Serviceable (SV)', value: 'Serviceable' },
        ],
      },
      initialValue: 'New',
    }),
    defineField({
      name: 'description',
      title: 'Technical Notes',
      type: 'text',
      description: 'Mention specific brand (Goodyear/Michelin) or tube requirements.',
    }),
    defineField({
      name: 'partImage',
      title: 'Certification Photo / Tag',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload the 8130-3 or EASA Form 1 image for client trust.'
    }),
  ],
})