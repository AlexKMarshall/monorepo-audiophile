import { s } from 'sanity-typed-schema-builder'

export const productCategory = s.document({
  name: 'productCategory',
  title: 'Product Category',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: s.string(),
    },
    {
      name: 'order',
      title: 'Order',
      type: s.number(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: s.slug({
        options: {
          source: 'title',
        },
      }),
    },
  ],
})
