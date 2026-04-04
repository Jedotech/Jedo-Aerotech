import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons' // Added an icon for better UI

export default defineType({
  name: 'fleetUser',
  title: 'Fleet Users',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'organization',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(), // Recommended: Prevent empty names
    }),
    defineField({
      name: 'accessCode',
      title: 'Unique Access Code',
      type: 'string',
      description: 'The password assigned to this organization',
      validation: (Rule) => Rule.required(),
    }),
  ],
  // THIS BLOCK FIXES THE DROPDOWN DISPLAY
  preview: {
    select: {
      title: 'organization', // Tells Sanity: Use "organization" as the label
    },
  },
})