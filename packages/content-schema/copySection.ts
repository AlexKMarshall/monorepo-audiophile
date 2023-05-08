import { sanityImageSourceZodSchema } from './image'
import { s } from 'sanity-typed-schema-builder'
import { z } from 'zod'

export const copySection = s.document({
  name: 'copySection',
  title: 'Copy Section',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: s.array({
        of: [s.block({})],
      }),
    },
    {
      name: 'copy',
      title: 'Copy',
      type: s.array({
        of: [s.block({})],
      }),
    },
    {
      name: 'image',
      title: 'Image',
      type: s.image({ hotspot: true }),
    },
  ],
})

export const copySectionZod = z.object({
  title: z.array(
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
  copy: z.array(
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
  image: sanityImageSourceZodSchema,
})
