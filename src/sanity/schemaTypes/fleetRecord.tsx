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
    // ... Keep all other fields exactly as they are ...
  ],

  // THIS IS THE SECRET TO FIXING THAT SPECIFIC SEARCH BAR
  preview: {
    select: {
      title: 'tailNumber',
      orgName: 'schoolName.organization',
      pos: 'tyrePosition',
    },
    prepare({ title, orgName, pos }) {
      return {
        title: title,
        // We include the orgName in the subtitle. 
        // Sanity indexes the subtitle for the document list search bar.
        subtitle: `${pos || 'Gear'} | ${orgName || 'Unassigned'}`
      }
    }
  },

  // ADD THIS BLOCK: It forces the search engine to look at the organization field 
  // even if it's inside a reference.
  orderings: [
    {
      title: 'Organization',
      name: 'orgAsc',
      by: [{ field: 'schoolName.organization', direction: 'asc' }]
    }
  ]
})