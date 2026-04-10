import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons' // ARCHITECT'S FIX: Replaced non-existent AirplaneIcon

export default defineType({
  name: 'aircraft',
  title: 'Aircraft Registry',
  type: 'document', 
  icon: RocketIcon,
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
        list: [
          'Cessna 172', 
          'Cessna 152', 
          'Piper Archer', 
          'Beechcraft Baron',
          'Airbus A320',
          'Boeing 737'
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // ARCHITECT'S ALIGNMENT: Renamed from 'organization' to 'schoolName' 
    // to match the filter logic in your Fleet Management schema.
    defineField({
      name: 'schoolName',
      title: 'Operating School',
      type: 'reference',
      to: [{ type: 'fleetUser' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { 
      title: 'tailNumber', 
      subtitle: 'model' 
    }
  }
})