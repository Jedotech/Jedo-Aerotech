import { defineField, defineType } from 'sanity'
import { RocketIcon, UserIcon, CogIcon } from '@sanity/icons'

export default defineType({
  name: 'part',
  title: 'Aircraft Components',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'technical', title: 'Technical Specs' },
    { name: 'management', title: 'Customer & Status' },
    { name: 'history', title: 'Maintenance Log' },
  ],
  fields: [
    // --- TECHNICAL GROUP ---
    defineField({
      name: 'serialNumber',
      title: 'Serial Number',
      type: 'string',
      group: 'technical',
      validation: (Rule) => Rule.required(),
      description: 'The unique manufacturer serial number (e.g., SN-10245)',
    }),
    defineField({
      name: 'aircraftType',
      title: 'Aircraft Type',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          { title: 'Cessna 172 Skyhawk', value: 'Cessna 172' },
          { title: 'Cessna 152', value: 'Cessna 152' },
          { title: 'Piper Archer', value: 'Piper Archer' },
        ],
      },
    }),
    defineField({
      name: 'maxDesignLife',
      title: 'Max Design Life (Landings)',
      type: 'number',
      group: 'technical',
      description: 'Standard retirement limit (e.g., 350 for Cessna 172 mains).',
      initialValue: 350,
    }),

    // --- MANAGEMENT GROUP ---
    defineField({
      name: 'ownerEmail',
      title: 'Customer / Owner Email',
      type: 'string',
      group: 'management',
      description: 'The primary identifier for dashboard access (e.g., tajesudoss@gmail.com).',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'status',
      title: 'Operational Status',
      type: 'string',
      group: 'management',
      options: {
        list: [
          { title: 'In-Service', value: 'active' },
          { title: 'Critical / AOG', value: 'critical' },
          { title: 'Retired / Scrapped', value: 'retired' },
        ],
        layout: 'radio' // Makes it easier to select quickly
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'totalLandings',
      title: 'Current Landings',
      type: 'number',
      group: 'management',
      initialValue: 0,
    }),
    defineField({
      name: 'priceUSD',
      title: 'Unit Price (USD)',
      type: 'number',
      group: 'management',
    }),

    // --- HISTORY GROUP ---
    defineField({
      name: 'maintenanceNotes',
      title: 'Maintenance Log Notes',
      type: 'text',
      group: 'history',
      description: 'Details on why this tyre was replaced or current condition.',
    }),
  ],
  preview: {
    select: {
      sn: 'serialNumber',
      type: 'aircraftType',
      landings: 'totalLandings',
      status: 'status',
    },
    prepare({ sn, type, landings, status }) {
      const statusEmoji = status === 'active' ? '✅' : status === 'critical' ? '⚠️' : '❌';
      return {
        title: `${sn} [${type}]`,
        subtitle: `${statusEmoji} Landings: ${landings || 0}`,
      }
    },
  },
})