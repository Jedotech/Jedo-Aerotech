import { defineType, defineField } from 'sanity'
import { PackageIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Tyre Inventory & Fleet Intel',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model',
      type: 'string',
      description: 'e.g., Cessna 172, Cessna 152, Piper Archer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
      description: 'The manufacturer part number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      description: 'Used to track wear-quality differences between brands',
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
    defineField({
      name: 'gearPosition',
      title: 'Gear Position',
      type: 'string',
      description: 'e.g., Nose, Main (Left), Main (Right)',
      options: {
        list: [
          { title: 'Nose Gear', value: 'Nose' },
          { title: 'Main Gear', value: 'Main' },
          { title: 'Main (Left)', value: 'Main-L' },
          { title: 'Main (Right)', value: 'Main-R' },
        ],
      },
    }),
    
    // --- FLEET INTELLIGENCE & LIFE CYCLE ---
    defineField({
      name: 'totalLandings',
      title: 'Accumulated Landings (TSN)',
      type: 'number',
      description: 'Current landings recorded on the tyre',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Cycles)',
      type: 'number',
      description: 'Maximum allowable landings before mandatory replacement',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'dailyUtilization',
      title: 'Daily Landings (Avg)',
      type: 'number',
      description: 'Average landings per day to calculate "Days Remaining"',
      initialValue: 0,
    }),
    defineField({
      name: 'installDate',
      title: 'Installation Date',
      type: 'date',
      description: 'When was this tyre fitted to the aircraft?',
    }),

    // --- STOCK & CONDITION ---
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
      name: 'certificates',
      title: 'Airworthiness Certifications',
      type: 'array',
      description: 'Select documentation available with this part',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'DGCA Form 1', value: 'DGCA' },
          { title: 'FAA 8130-3', value: '8130-3' },
          { title: 'EASA Form 1', value: 'EASA' },
          { title: 'CoC (Certificate of Conformance)', value: 'CoC' },
        ],
        layout: 'grid',
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
      options: {
        list: ['Chennai Hub', 'Singapore Hub', 'USA Hub'],
      },
    }),
    defineField({
      name: 'description',
      title: 'Technical Description',
      type: 'text',
      description: 'Additional technical remarks or specifications',
    }),
    defineField({
      name: 'ownerEmail',
      title: 'Owner/Manager Email',
      type: 'string',
      description: 'Contact email for internal stock management',
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    select: {
      title: 'partNumber',
      subtitle: 'manufacturer',
    },
  },
})