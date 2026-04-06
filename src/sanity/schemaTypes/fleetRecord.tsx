import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'fleetRecord',
  title: 'Fleet Management',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'schoolName',
      title: 'Aviation School',
      type: 'reference',
      to: [{ type: 'fleetUser' }],
    }),
    defineField({
      name: 'tailNumber',
      title: 'Registration / Tail Number',
      type: 'string',
    }),
    // ENSURE THIS FIELD EXISTS IF YOU WANT TO SORT BY IT
    defineField({
      name: 'aircraftModel',
      title: 'Aircraft Model',
      type: 'string',
    }),
  ],

  // Update orderings to ONLY target existing fields
  orderings: [
    {
      title: 'Tail Number, A-Z',
      name: 'tailNumberAsc',
      by: [{ field: 'tailNumber', direction: 'asc' }]
    },
    {
      title: 'School Name, A-Z',
      name: 'schoolNameAsc',
      by: [{ field: 'schoolName.organization', direction: 'asc' }]
    }
  ],

  preview: {
    select: {
      title: 'tailNumber',
      orgName: 'schoolName.organization',
    },
    prepare({ title, orgName }) {
      return {
        title: title,
        subtitle: orgName || 'Unassigned'
      }
    }
  }
})