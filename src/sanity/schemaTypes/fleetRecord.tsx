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
  
  // --- UPDATED PREVIEW FOR CEO & MASTER TECH VIEW ---
  preview: {
    select: {
      tail: 'tailNumber',
      pos: 'tyrePosition',
      current: 'currentLandings',
      max: 'maxDesignLife',
      pn: 'partNumber',
      org: 'schoolName.organization'
    },
    prepare({ tail, pos, current, max, pn, org }) {
      // Technical Indicator Mapping (N, ML, MR)
      const posCode = pos === 'Nose Gear' ? 'N' : pos === 'Main Left' ? 'ML' : pos === 'Main Right' ? 'MR' : '??';
      
      // Maintenance Ratio Calculation
      const ratio = `${current || 0} / ${max || 250}`;
      
      // Remaining Landings (Grounding Metric)
      const remaining = (max || 250) - (current || 0);
      
      return {
        // Example Title: VT-ACC [ML] - P/N: 505C86-10
        title: `${tail} [${posCode}] - P/N: ${pn || 'TBD'}`,
        // Example Subtitle: 10 / 250 LNDG (240 Left) | Fly High School
        subtitle: `${ratio} LNDG (${remaining} LEFT) | ${org || 'No School'}`
      }
    }
  },
})