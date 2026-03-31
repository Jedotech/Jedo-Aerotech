import { defineType, defineField } from 'sanity'
import { PackageIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Tyre Inventory',
  type: 'document',
  icon: PackageIcon,
  fields: [
    // --- BASIC IDENTIFICATION ---
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model Compatibility',
      type: 'string',
      description: 'e.g., Cessna 172, Cessna 152',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      options: {
        list: [
          { title: 'Michelin', value: 'Michelin' },
          { title: 'Goodyear', value: 'Goodyear' },
          { title: 'Dunlop', value: 'Dunlop' },
          { title: 'Condor', value: 'Condor' },
          { title: 'Specialty Tires (McCready)', value: 'Specialty' },
        ],
      },
    }),
    defineField({
      name: 'tyreModel',
      title: 'Tyre Model/Line',
      type: 'string',
      description: 'e.g., Aviator, Flight Custom III',
    }),

    // --- PHYSICAL SPECS ---
    defineField({
      name: 'tyreSize',
      title: 'Tyre Size',
      type: 'string',
      description: 'e.g., 6.00-6',
    }),
    defineField({
      name: 'plyRating',
      title: 'Ply Rating',
      type: 'string',
      description: 'e.g., 4, 6, 8',
    }),

    // --- CONDITION & LOGISTICS ---
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      initialValue: 'New',
      options: {
        list: [
          { title: 'New / Factory New (FN)', value: 'New' },
          { title: 'New Surplus (NS)', value: 'New Surplus' },
          { title: 'Overhauled (OH)', value: 'Overhauled' },
          { title: 'Serviceable (SV)', value: 'Serviceable' },
        ],
      },
    }),
    defineField({
      name: 'quantity',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'priceUSD',
      title: 'Unit Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'warehouse',
      title: 'Warehouse Location',
      type: 'string',
      initialValue: 'Chennai Hub',
      options: { list: ['Chennai Hub', 'Singapore Hub', 'USA Hub'] },
    }),

    // --- DOCUMENTATION ---
    defineField({
      name: 'certificates',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'DGCA Form 1', value: 'DGCA' },
          { title: 'FAA 8130-3', value: '8130-3' },
          { title: 'EASA Form 1', value: 'EASA' },
          { title: 'CoC (Certificate of Conformance)', value: 'CoC' },
        ],
      },
    }),

    // --- TECHNICAL REMARKS ---
    defineField({
      name: 'description',
      title: 'Technical Description',
      type: 'text',
      description: 'Additional technical remarks or specifications (e.g., shelf life, storage notes)',
    }),
  ],
  preview: {
    select: {
      title: 'partNumber',
      subtitle: 'manufacturer',
    },
  },
})