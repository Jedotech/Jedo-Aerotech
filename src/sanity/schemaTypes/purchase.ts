import { defineType, defineField } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export default defineType({
  name: 'purchase',
  title: 'Purchase Records',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order / Invoice Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'purchaseDate',
      title: 'Purchase Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buyer',
      title: 'Buyer (Client)',
      type: 'reference',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'aircraft',
      title: 'Associated Aircraft',
      type: 'reference',
      description: 'Which aircraft is this part for?',
      to: [{ type: 'fleetRecord' }], // Updated from 'aircraft' to 'fleetRecord'
    }),
    defineField({
      name: 'itemDescription',
      title: 'Item Description',
      type: 'string',
      description: 'e.g., Nose Tyre - Michelin Air',
    }),
    defineField({
      name: 'unitPrice',
      title: 'Unit Price (USD)',
      type: 'number',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (Calculated)',
      type: 'number',
      description: 'Price x Quantity',
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'itemDescription',
    },
  },
})