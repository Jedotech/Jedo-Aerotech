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

    // --- RE-ADDED MISSING FIELD: tyreModel ---
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

    defineField({
      name: 'tyrePosition',
      title: 'Installation Position',
      type: 'string',
      options: {
        list: ['Nose Gear', 'Main Left', 'Main Right'],
      },
    }),

    // --- RE-ADDED MISSING FIELD: installDate ---
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

    // --- RE-ADDED MISSING FIELD: dailyUtilization ---
    defineField({
      name: 'dailyUtilization',
      title: 'Daily Utilization (Avg Landings/Day)',
      type: 'number',
    }),

    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
    }),

    // --- RE-ADDED MISSING FIELD: maintenanceLog ---
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
  ],

  preview: {
    select: {
      title: 'tailNumber',
      orgName: 'schoolName.organization',
      pos: 'tyrePosition',
    },
    prepare({ title, orgName, pos }) {
      return {
        title: title,
        subtitle: `${pos || 'Gear'} | ${orgName || 'Loading School...'}`
      }
    }
  },
})