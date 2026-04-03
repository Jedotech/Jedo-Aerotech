import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fleetUser',
  title: 'Fleet Users',
  type: 'document',
  fields: [
    defineField({
      name: 'organization',
      title: 'Organization Name',
      type: 'string',
    }),
    defineField({
      name: 'accessCode',
      title: 'Unique Access Code',
      type: 'string',
      description: 'The password assigned to this organization'
    }),
  ],
})