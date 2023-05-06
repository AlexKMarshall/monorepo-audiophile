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
      name: 'mainImage',
      title: 'Main image',
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
  title: z.string(),
  slug: slugZodSchema,
  description: z.string(),
  isNew: z.boolean().optional(),
  price: priceZodSchema,
  mainImage: z.object({
    mobile: sanityImageSourceZodSchema,
    alt: z.string(),
    tablet: sanityImageSourceZodSchema.optional(),
    desktop: sanityImageSourceZodSchema.optional(),
  }),
  previewImage: z.object({
    mobile: sanityImageSourceZodSchema,
    alt: z.string(),
    tablet: sanityImageSourceZodSchema.optional(),
    desktop: sanityImageSourceZodSchema.optional(),
  }),
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
