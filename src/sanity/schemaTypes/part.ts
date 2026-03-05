export const part = { 

  name: 'part',

  type: 'document',

  title: 'Aircraft Part',

  fields: [

    {

      name: 'partNumber',

      type: 'string',

      title: 'Part Number',

    },

    {

      name: 'aircraftType',

      type: 'string',

      title: 'Aircraft Compatibility',

      description: 'e.g. Cessna 152, 172, Piper Seneca, etc.',

    },

    {

      name: 'partImage',

      type: 'image',

      title: 'Part Photo / Tag Image',

      options: { hotspot: true },

    },

    {

      name: 'condition',

      type: 'string',

      title: 'Condition',

    },

    {

      name: 'location',

      type: 'string',

      title: 'Physical Location',

    },

    {

      name: 'price',

      type: 'number',

      title: 'Price (USD)',

    },

    {

      name: 'internalNotes',

      type: 'text',

      title: 'Internal Broker Notes',

    },

    {

      name: 'description',

      type: 'text',

      title: 'Public Description',

    },

  ],

  preview: {

    select: {

      title: 'partNumber',

      subtitle: 'aircraftType',

      media: 'partImage',

    },

  },

}