import { currency, currencyZodSchema } from './currency'
import { s } from 'sanity-typed-schema-builder'
import { z } from 'zod'

export const price = s.object({
  fields: [
    {
      name: 'currency',
      title: 'Currency',
      type: s.reference({
        to: [currency],
      }),
    },
    {
      name: 'amount',
      title: 'Amount',
      type: s.number({ min: 0 }),
    },
  ],
})

export const priceZodSchema = z.object({
  currency: currencyZodSchema,
  amount: z.number().min(0),
})
