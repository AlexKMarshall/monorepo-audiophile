import { s } from 'sanity-typed-schema-builder'
import { slugZodSchema } from './slug'
import { z } from 'zod'
import { sanityImageSourceZodSchema } from './image'
import { productCategory } from './productCategory'

export const product = s.document({
  name: 'product',
  title: 'Product',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: s.string(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: s.slug({ options: { source: 'title' } }),
    },
    {
      name: 'category',
      title: 'Category',
      type: s.reference({
        to: [productCategory],
      }),
    },
    { name: 'description', title: 'Description', type: s.string() },
    { name: 'isNew', title: 'Is new?', type: s.boolean(), optional: true },
    {
      name: 'previewImage',
      title: 'Preview image',
      type: s.object({
        fields: [
          {
            name: 'mobile',
            title: 'Mobile',
            type: s.image(),
          },
          { name: 'alt', title: 'Alt', type: s.string() },
          {
            name: 'tablet',
            title: 'Tablet',
            type: s.image(),
            optional: true,
          },
          {
            name: 'desktop',
            title: 'Desktop',
            type: s.image(),
            optional: true,
          },
        ],
      }),
    },
    {
      name: 'order',
      title: 'Order',
      type: s.number(),
    },
  ],
})

export const productZod = z.object({
  title: z.string(),
  slug: slugZodSchema,
  description: z.string(),
  isNew: z.boolean().optional(),
  previewImage: z.object({
    mobile: sanityImageSourceZodSchema,
    alt: z.string(),
    tablet: sanityImageSourceZodSchema.optional(),
    desktop: sanityImageSourceZodSchema.optional(),
  }),
  order: z.number(),
})
