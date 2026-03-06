import { defineType, defineField } from 'sanity'

export const parts = defineType({
  name: 'part', // IMPORTANT: Keep this as 'part' so the website finds it
  title: 'Aircraft Part',
  type: 'document',
  fields: [
    defineField({
      name: 'partNumber',
      title: 'Part Number',
      type: 'string',
    }),
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Compatibility',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Stock Level (Qty)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'warehouse',
      title: 'Warehouse Hub',
      type: 'string',
      options: {
        list: [
          { title: 'Chennai, India', value: 'Chennai' },
          { title: 'Singapore Hub', value: 'Singapore' },
          { title: 'USA Warehouse', value: 'USA' },
        ],
      },
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
})