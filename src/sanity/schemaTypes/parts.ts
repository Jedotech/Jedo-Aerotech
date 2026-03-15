// Inside the fields: [ ... ] array of your parts schema
defineField({
  name: 'clientEmail',
  title: 'Client Email (Assignment)',
  type: 'string',
  description: 'Enter the email of the flight school. This links the tyre to their private dashboard.',
}),
defineField({
  name: 'maxDesignLife',
  title: 'Max Design Life (Landings)',
  type: 'number',
  description: 'The maximum landing cycles before this tyre is considered critical (Default is 350).',
  initialValue: 350,
}),