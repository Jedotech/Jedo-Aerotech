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
      name: 'priceUSD',
      title: 'Base Price (USD)',
      type: 'number',
      description: 'The global sourcing price in USD. This will be automatically converted to INR on the website.',
    }),
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Compatibility',
      type: 'string',
      description: 'e.g., Cessna 172, Piper Archer, etc.',
      initialValue: 'Cessna 172',
    }),
    defineField({
      name: 'quantity',
      title: 'Availability Status',
      type: 'number',
      description: 'Set to 0 to show "Available to Source" or 1+ to show "Ready Hub".',
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
    }),
    defineField({
      name: 'description',
      title: 'Detailed Specifications',
      type: 'text',
      description: 'Mention Ply Rating, Brand (Goodyear/Michelin), and Tube requirements.',
    }),
    defineField({
      name: 'partImage',
      title: 'Certification Photo / Tag',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload the 8130-3 or EASA Form 1 image for trust.'
    }),
  ],
})