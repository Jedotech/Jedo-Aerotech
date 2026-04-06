import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'fleetRecord',
  title: 'Fleet Management',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    // --- ORGANIZATION REFERENCE ---
    defineField({
      name: 'schoolName',
      title: 'Aviation School / Organization',
      type: 'reference',
      to: [{ type: 'fleetUser' }],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tailNumber',
      title: 'Registration / Tail Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'aircraftModel',
      title: 'Aircraft Model',
      type: 'string',
      options: {
        list: ['Cessna 172', 'Cessna 152', 'Piper Archer', 'Beechcraft Baron'],
      },
    }),

    defineField({
      name: 'tyreModel',
      title: 'Tyre Model',
      type: 'string',
    }),

    defineField({
      name: 'manufacturer',
      title: 'Tyre Brand (Make)',
      type: 'string',
      options: {
        list: [
          { title: 'Michelin', value: 'Michelin' },
          { title: 'Goodyear', value: 'Goodyear' },
          { title: 'Dunlop', value: 'Dunlop' },
          { title: 'Condor', value: 'Condor' },
        ],
      },
    }),

    // --- VENDOR & SOURCING DETAILS ---
    defineField({
      name: 'vendorName',
      title: 'Sourcing Vendor',
      type: 'string',
      initialValue: 'Jedo Technologies Pvt. Ltd.',
      description: 'The agency responsible for sourcing this asset.',
      readOnly: true, 
    }),

    defineField({
      name: 'tyrePosition',
      title: 'Installation Position',
      type: 'string',
      options: {
        list: ['Nose Gear', 'Main Left', 'Main Right'],
      },
    }),

    defineField({
      name: 'installDate',
      title: 'Installation Date',
      type: 'date',
    }),

    defineField({
      name: 'currentLandings',
      title: 'Accumulated Landings',
      type: 'number',
      initialValue: 0,
    }),

    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life',
      type: 'number',
      initialValue: 250,
    }),

    defineField({
      name: 'dailyUtilization',
      title: 'Daily Utilization (Avg Landings/Day)',
      type: 'number',
    }),

    // --- ADDED: purchasePrice (To fix "Unknown Field" error) ---
    defineField({
      name: 'purchasePrice',
      title: 'Purchase Price (USD)',
      type: 'number',
    }),

    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
    }),

    defineField({
      name: 'maintenanceLog',
      title: 'Maintenance / Journey Log Notes',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'operatorEmail',
      title: 'Owner / Maintenance Email',
      type: 'string',
    }),

    // --- MRO ANALYTICS & ASSET TRACKING ---
    defineField({
      name: 'serialNumber',
      title: 'Tyre Serial Number (S/N)',
      type: 'string',
      description: 'Unique manufacturer ID for individual tracking.',
    }),

    defineField({
      name: 'retreadStatus',
      title: 'Retread Level',
      type: 'string',
      options: {
        list: [
          { title: 'New (Virgin)', value: 'New' },
          { title: 'R1 (1st Retread)', value: 'R1' },
          { title: 'R2 (2nd Retread)', value: 'R2' },
          { title: 'R3 (3rd Retread)', value: 'R3' },
          { title: 'R4 (4th Retread)', value: 'R4' },
        ],
      },
    }),

    defineField({
      name: 'status',
      title: 'Asset Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active (In Service)', value: 'active' },
          { title: 'Retired (Replaced)', value: 'retired' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'removalReason',
      title: 'Reason for Removal',
      type: 'string',
      hidden: ({ document }) => document?.status === 'active',
      options: {
        list: [
          { title: 'Normal Wear (Limit Reached)', value: 'Normal Wear' },
          { title: 'FOD (Foreign Object Damage)', value: 'FOD' },
          { title: 'Flat Spot (Braking)', value: 'Flat Spot' },
          { title: 'Sidewall Cut', value: 'Sidewall Cut' },
          { title: 'Casing Failure', value: 'Casing Failure' },
        ],
      },
    }),
  ],

  // --- SORTING CONFIGURATION ---
  orderings: [
    {
      title: 'Aviation School (A-Z)',
      name: 'schoolNameAsc',
      by: [{ field: 'schoolName.organization', direction: 'asc' }],
    },
    {
      title: 'Aviation School (Z-A)',
      name: 'schoolNameDesc',
      by: [{ field: 'schoolName.organization', direction: 'desc' }],
    },
  ],

  // --- PREVIEW ---
  preview: {
    select: {
      title: 'tailNumber',
      orgName: 'schoolName.organization',
      pos: 'tyrePosition',
      status: 'status',
    },
    prepare({ title, orgName, pos, status }) {
      const statusIcon = status === 'retired' ? '📁 [ARCHIVED] ' : '';
      return {
        title: `${statusIcon}${title}`,
        subtitle: `${pos || 'Gear'} | ${orgName || 'Loading School...'}`
      }
    }
  },
})