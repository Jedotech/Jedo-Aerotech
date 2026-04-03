export default {
  name: 'fleetUser',
  title: 'Fleet Users',
  type: 'document',
  fields: [
    {
      name: 'organization',
      title: 'Organization Name',
      type: 'string',
    },
    {
      name: 'accessCode',
      title: 'Unique Access Code',
      type: 'string',
      description: 'The password assigned to this organization'
    },
  ],
}