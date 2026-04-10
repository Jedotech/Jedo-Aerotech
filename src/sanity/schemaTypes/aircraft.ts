import { defineType, defineField } from 'sanity'
import { AirplaneIcon } from '@sanity/icons'

export default defineType({
  name: 'aircraft',
  title: 'Aircraft Registry',
  type: 'document', // <--- THIS LINE IS CRITICAL FOR REFERENCES TO WORK
  icon: AirplaneIcon,
  fields: [
    defineField({
      name: 'tailNumber',
      title: 'Registration (Tail Number)',
      type: 'string',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: 'model',
      title: 'Aircraft Model',
      type: 'string',
      options: {
        list: ['Cessna 172', 'Cessna 152', 'Piper Archer', 'Beechcraft Baron'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Operating School',
      type: 'reference',
      to: [{ type: 'fleetUser' }],
    }),
  ],
  preview: {
    select: { title: 'tailNumber', subtitle: 'model' }
  }
})   