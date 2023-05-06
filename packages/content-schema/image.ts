import { z } from 'zod'

const sanityReferenceZodSchema = z.object({
  _ref: z.string(),
})
const sanityAssetZodSchema = z.object({
  _id: z.string().optional(),
  _url: z.string().optional(),
  _path: z.string().optional(),
  _assetId: z.string().optional(),
  _extension: z.string().optional(),
})
const sanityImageCropZodSchema = z.object({
  _type: z.string().optional(),
  left: z.number(),
  bottom: z.number(),
  right: z.number(),
  top: z.number(),
})
const SanityImageHotspotZodSchema = z.object({
  _type: z.string().optional(),
  width: z.number(),
  height: z.number(),
  x: z.number(),
  y: z.number(),
})
const sanityImageObjectZodSchema = z.object({
  asset: z.union([sanityReferenceZodSchema, sanityAssetZodSchema]),
  crop: sanityImageCropZodSchema.optional(),
  hotspot: SanityImageHotspotZodSchema.optional(),
})
const sanityImageWithAssetStubSchema = z.object({
  asset: z.object({
    url: z.string(),
  }),
})

export const sanityImageSourceZodSchema = z.object({
  _type: z.literal('image'),
  asset: z.object({
    _ref: z.string(),
    _type: z.literal('reference'),
  }),
})
