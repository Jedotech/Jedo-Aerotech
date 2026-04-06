import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'fleetRecord',
  title: 'Fleet Management',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    // --- MULTI-TENANCY / ORGANIZATION ---
    defineField({
      name: 'schoolName',
      title: 'Aviation School / Organization',
      type: 'reference',
      to: [{ type: 'fleetUser' }],
      description: 'Select the school this aircraft belongs to (Dynamic list from Fleet Users)',
      weak: true,
      validation: (Rule) => Rule.required().error('You must assign this aircraft to a school.'),
      options: {
        disableNew: false, 
      }
    }),

    // --- AIRCRAFT IDENTIFICATION ---
    defineField({
      name: 'tailNumber',
      title: 'Registration / Tail Number',
      type: 'string',
      description: 'e.g., VT-ACC',
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

    // --- TYRE SPECIFICATIONS ---
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
      name: 'tyreModel',
      title: 'Tyre Model',
      type: 'string',
      description: 'e.g., Pilot, Flight Custom III',
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number (P/N)',
      type: 'string',
      description: 'Specific manufacturer part number for procurement',
    }),
    defineField({
      name: 'tyrePosition',
      title: 'Installation Position',
      type: 'string',
      options: {
        list: ['Nose Gear', 'Main Left', 'Main Right'],
      },
    }),

    // --- LIFE METRICS ---
    defineField({
      name: 'installDate',
      title: 'Installation Date',
      type: 'date',
    }),
    defineField({
      name: 'currentLandings',
      title: 'Accumulated Landings (Current)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Rated Landings)',
      type: 'number',
      initialValue: 250,
    }),

    // --- PREDICTIVE ANALYTICS ---
    defineField({
      name: 'dailyUtilization',
      title: 'Daily Utilization (Avg Landings/Day)',
      type: 'number',
      initialValue: 5,
    }),

    // --- FINANCIAL INTELLIGENCE ---
    defineField({
      name: 'purchasePrice',
      title: 'Tyre Purchase Price (USD)',
      type: 'number',
    }),

    // --- LOGS & AUDIT TRAIL ---
    defineField({
      name: 'maintenanceLog',
      title: 'Maintenance / Journey Log Notes',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // --- AUTOMATION CONTACT ---
    defineField({
      name: 'operatorEmail',
      title: 'Owner / Maintenance Email',
      type: 'string',
    }),
  ],
  
  // --- PREVIEW CONFIGURATION ---
  preview: {
    select: {
      title: 'tailNumber',
      orgName: 'schoolName.organization', // This mapping is correct for search
      pos: 'tyrePosition',
    },
    prepare({ title, orgName, pos }) {
      return {
        title: title,
        // Concatenating the school name here ensures Sanity indexes it for the search box
        subtitle: `${pos || 'Unspecified Gear'} | ${orgName || 'Unassigned School'}`
      }
    }
  },
})