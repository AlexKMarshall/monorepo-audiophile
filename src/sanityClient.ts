import { createClient } from '@sanity/client'
import { env } from './env.mjs'

export const sanityClient = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
})
