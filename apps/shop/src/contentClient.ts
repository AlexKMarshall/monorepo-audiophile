import { z } from 'zod'
import { env } from './env.mjs'
import type { JsonValue } from 'type-fest'

const dataset = env.SANITY_DATASET
const project = env.SANITY_PROJECT_ID
const baseUrl = `https://${project}.api.sanity.io/v2023-05-09/data/query/${dataset}`

export async function fetchQuery<T extends z.ZodType<JsonValue>>({
  query,
  params,
  validationSchema,
}: {
  query: string
  params?: Record<string, string | string[]>
  validationSchema: T
}) {
  const url = new URL(baseUrl)
  url.searchParams.set('query', query)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const keyWithDollar = `$${key}`
      url.searchParams.set(keyWithDollar, JSON.stringify(value))
    })
  }

  const resultSchema = z.object({
    result: validationSchema,
  })

  return fetch(url)
    .then((res) => res.json())
    .then((data) => resultSchema.parse(data))
}
