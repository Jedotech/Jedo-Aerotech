import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accessCode',
      title: 'Unique Access Code',
      type: 'string',
      description: 'The password assigned to this organization',
      validation: (Rule) => Rule.required(),
    }),
    // --- ADDED ROLE FIELD FOR ADMIN INTELLIGENCE ---
    defineField({
      name: 'role',
      title: 'User Role',
      type: 'string',
      description: 'Determines if the user sees their own fleet or the Master Intelligence Dashboard',
      initialValue: 'OPERATOR',
      options: {
        list: [
          { title: 'Admin (Jedo Internal)', value: 'ADMIN' },
          { title: 'Operator (Client)', value: 'OPERATOR' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'organization',
      subtitle: 'role', // Added subtitle so you can see roles at a glance in the list
    },
  },
})