import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons' // Switched from PilotIcon to UsersIcon

export default defineType({
  name: 'fleet',
  title: 'Fleet Management',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Model',
      type: 'string',
      options: {
        list: ['Cessna 172', 'Cessna 152', 'Piper Archer', 'Beechcraft Baron'],
      },
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number',
      type: 'string',
      description: 'The Serial or Part Number for the tracked component',
    }),
    defineField({
      name: 'totalLandings',
      title: 'Current Landings',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Landings)',
      type: 'number',
      initialValue: 350,
    }),
    defineField({
      name: 'ownerEmail',
      title: 'Owner / Operator Email',
      type: 'string',
      description: 'Used for automated maintenance alerts',
    }),
  ],
  preview: {
    select: {
      title: 'aircraftType',
      subtitle: 'ownerEmail',
    },
  },
})