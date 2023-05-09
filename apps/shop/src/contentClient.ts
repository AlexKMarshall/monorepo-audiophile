import { z } from 'zod'
import { env } from './env.mjs'

const dataset = env.SANITY_DATASET
const project = env.SANITY_PROJECT_ID
const baseUrl = `https://${project}.api.sanity.io/v2023-05-09/data/query/${dataset}`

export async function fetchQuery<T extends z.ZodTypeAny>({
  query,
  params,
  validationSchema,
}: {
  query: string
  params?: Record<string, string>
  validationSchema: T
}): Promise<ReturnType<T['parse']>> {
  const url = new URL(baseUrl)
  url.searchParams.set('query', query)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const keyWithDollar = `$${key}`
      const valueInQuotes = `"${value}"`
      url.searchParams.set(keyWithDollar, valueInQuotes)
    })
  }

  return fetch(url)
    .then((res) => res.json())
    .then((data) => validationSchema.parse(data.result))
}
