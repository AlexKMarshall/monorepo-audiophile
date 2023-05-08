import { sanityImageSourceZodSchema } from './image'
import { s } from 'sanity-typed-schema-builder'
import { slugZodSchema } from './slug'
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
    { name: 'thumbnailNew', title: 'Thumbnail', type: s.image() },
  ],
})

export const productCategoryZod = z.object({
  title: z.string(),
  order: z.number(),
  slug: slugZodSchema,
  thumbnailNew: sanityImageSourceZodSchema,
  thumbnail: z.object({
    mobile: sanityImageSourceZodSchema,
    tablet: sanityImageSourceZodSchema.optional(),
    desktop: sanityImageSourceZodSchema.optional(),
  }),
})
