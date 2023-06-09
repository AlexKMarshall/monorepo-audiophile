import { s } from 'sanity-typed-schema-builder'
import { slugZodSchema } from './slug'
import { z } from 'zod'
import { sanityImageSourceZodSchema } from './image'
import { productCategory } from './productCategory'
import { price, priceZodSchema } from './price'

const baseProduct = {
  name: 'product',
  title: 'Product',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: s.string(),
    },
    {
      name: 'shortTitle',
      title: 'Short title',
      type: s.string(),
      optional: true,
    },
    {
      name: 'shortestTitle',
      title: 'Shortest title',
      type: s.string(),
      optional: true,
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
    { name: 'description', title: 'Description', type: s.text() },
    { name: 'isNew', title: 'Is new?', type: s.boolean(), optional: true },
    { name: 'price', title: 'Price', type: price },
    {
      name: 'features',
      title: 'Features',
      type: s.array({
        of: [s.block({})],
      }),
    },
    {
      name: 'boxIncludes',
      title: 'Box includes',
      type: s.array({
        of: [
          s.object({
            fields: [
              { name: 'item', title: 'Item', type: s.string() },
              {
                name: 'quantity',
                title: 'Quantity',
                type: s.number({ min: 1 }),
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'mainImageNew',
      title: 'Main image',
      type: s.image({
        hotspot: true,
      }),
    },
    {
      name: 'thumbnailImageNew',
      title: 'Thumbnail image',
      type: s.image({
        hotspot: true,
      }),
    },
    {
      name: 'galleryNew',
      title: 'Gallery',
      type: s.array({
        of: [
          s.image({
            hotspot: true,
          }),
        ],
      }),
    },
    {
      name: 'order',
      title: 'Order',
      type: s.number(),
    },
  ],
} satisfies Parameters<typeof s.document>[0]

export const product = s.document({
  ...baseProduct,
  fields: [
    ...baseProduct.fields,
    {
      name: 'relatedProducts',
      title: 'Related products',
      type: s.array({
        of: [
          s.reference({
            to: [s.document(baseProduct)],
          }),
        ],
      }),
    },
  ],
})

const baseProductZod = z.object({
  _id: z.string(),
  title: z.string(),
  shortTitle: z.string().nullable(),
  shortestTitle: z.string().nullable(),
  slug: slugZodSchema,
  description: z.string(),
  isNew: z.boolean().optional(),
  price: priceZodSchema,
  mainImageNew: sanityImageSourceZodSchema,
  thumbnailImageNew: sanityImageSourceZodSchema,
  order: z.number(),
  features: z.array(
    z.object({
      _type: z.string(),
      style: z.string().optional(),
      _key: z.string(),
      children: z.array(
        z.object({
          _type: z.string(),
          _key: z.string(),
          marks: z.array(z.string()).optional(),
          text: z.string(),
        })
      ),
    })
  ),
  boxIncludes: z.array(
    z.object({
      _key: z.string(),
      item: z.string(),
      quantity: z.number(),
    })
  ),
})

export const productZod = baseProductZod.extend({
  relatedProducts: z.array(baseProductZod),
})
