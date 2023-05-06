import { sanityImageSourceZodSchema } from './image'
import { s } from 'sanity-typed-schema-builder'
import { z } from 'zod'

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
    {
      name: 'thumbnail',
      title: 'Thumbnail images',
      type: s.object({
        fields: [
          {
            name: 'mobile',
            title: 'Mobile',
            type: s.image(),
          },
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
  ],
})

export const productCategoryZod = z.object({
  title: z.string(),
  order: z.number(),
  slug: z.object({
    current: z.string(),
  }),
  thumbnail: z.object({
    mobile: sanityImageSourceZodSchema,
    tablet: sanityImageSourceZodSchema.optional(),
    desktop: sanityImageSourceZodSchema.optional(),
  }),
})
