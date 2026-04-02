import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'client',
  title: 'Flight Schools & Operators',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactPerson',
      title: 'Primary Contact Person',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Base Location',
      type: 'string',
      description: 'e.g., Chennai, Pondicherry, Hyderabad',
    }),
    defineField({
      name: 'assignedAircraft',
      title: 'Managed Fleet',
      type: 'array',
      description: 'Link this client to the aircraft they operate',
      of: [
        {
          type: 'reference',
          to: [{ type: 'fleetRecord' }], // Updated from 'aircraft'
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
    },
  },
})