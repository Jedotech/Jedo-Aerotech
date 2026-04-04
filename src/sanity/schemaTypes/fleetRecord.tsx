import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'fleetRecord',
  title: 'Fleet Management',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    // --- MULTI-TENANCY / ORGANIZATION (NOW DYNAMIC) ---
    defineField({
      name: 'schoolName',
      title: 'Aviation School / Organization',
      type: 'reference', // Changed from 'string' to 'reference'
      to: [{ type: 'fleetUser' }], // Points to your fleetUser schema
      description: 'Select the school this aircraft belongs to (Dynamic list from Fleet Users)',
      // We use weak: true so you can delete a user without breaking the aircraft record
      weak: true, 
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

    // --- LIFE METRICS (THE INPUTS) ---
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
      description: 'System automatically increments this via the Logbook Entry page.',
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Rated Landings)',
      type: 'number',
      initialValue: 250,
      description: 'The total landings the tyre is rated for by the manufacturer.',
    }),

    // --- PREDICTIVE ANALYTICS (DAILY UTILIZATION) ---
    defineField({
      name: 'dailyUtilization',
      title: 'Daily Utilization (Avg Landings/Day)',
      type: 'number',
      initialValue: 5,
      description: 'Used to calculate the "Countdown" to replacement.',
    }),

    // --- FINANCIAL INTELLIGENCE (CPL) ---
    defineField({
      name: 'purchasePrice',
      title: 'Tyre Purchase Price (USD)',
      type: 'number',
      description: 'Input the cost paid to calculate Cost Per Landing (CPL).',
    }),

    // --- LOGS & AUDIT TRAIL ---
    defineField({
      name: 'maintenanceLog',
      title: 'Maintenance / Journey Log Notes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'History of comments and notes added during daily logbook updates.',
    }),

    // --- AUTOMATION CONTACT ---
    defineField({
      name: 'operatorEmail',
      title: 'Owner / Maintenance Email',
      type: 'string',
      description: 'Used for automated alerts when the countdown reaches zero.',
    }),
  ],
  preview: {
    select: {
      title: 'tailNumber',
      subtitle: 'schoolName.organization', // Drill down into the reference to show organization name
    },
  },
})