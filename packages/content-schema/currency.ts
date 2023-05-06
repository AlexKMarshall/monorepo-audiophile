import { s } from 'sanity-typed-schema-builder'
import { z } from 'zod'

export const currency = s.document({
  name: 'currency',
  title: 'Currency',
  fields: [
    {
      name: 'isoCode',
      title: 'ISO Code',
      type: s.string(),
    },
    {
      name: 'symbol',
      title: 'Symbol',
      type: s.string(),
    },
    {
      name: 'name',
      title: 'Name',
      type: s.string(),
    },
  ],
})

export const currencyZodSchema = z.object({
  isoCode: z.string().min(3).max(3),
  symbol: z.string().min(1).max(1),
  name: z.string(),
})
