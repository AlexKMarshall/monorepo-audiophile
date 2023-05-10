import { type ReactNode } from 'react'
import { CenterContent } from '~/components/CenterContent'
import { urlFor } from '~/sanityClient'
import { copySectionZod } from '@audiophile/content-schema'
import {
  sanityImageCropZodSchema,
  sanityImageHotspotZodSchema,
  sanityImageSourceZodSchema,
} from '@audiophile/content-schema/image'
import { z } from 'zod'
import { screens } from 'tailwind.config'
import { PortableText } from '@portabletext/react'
import { fetchQuery } from '~/contentClient'

export default async function CatalogLayout({
  children,
}: {
  children: ReactNode
}) {
  const { result: copySection } = await fetchQuery({
    query: `*[_type == "copySection"][0]{
      title,
      copy,
      "image": {...image, 'altText': image.asset->altText}
    }`,
    validationSchema: copySectionZod.pick({ title: true, copy: true }).extend({
      image: sanityImageSourceZodSchema.extend({
        hotspot: sanityImageHotspotZodSchema,
        crop: sanityImageCropZodSchema,
        altText: z.string().nullable(),
      }),
    }),
  })

  return (
    <div>
      {children}
      <CenterContent>
        <div className="mb-32 flex flex-col items-center gap-10 sm:gap-16 lg:mb-40 lg:flex-row-reverse lg:gap-32">
          <div className="h-72 self-stretch overflow-hidden rounded-lg lg:h-auto lg:basis-1/2">
            <picture className="h-full w-full object-cover lg:h-auto lg:w-auto lg:object-none">
              <source
                media={`(min-width: ${screens.lg}px)`}
                srcSet={`${urlFor(copySection.image)
                  .size(540, 588)
                  .fit('crop')
                  .auto('format')
                  .url()}, ${urlFor(copySection.image)
                  .size(540, 588)
                  .fit('crop')
                  .auto('format')
                  .dpr(2)
                  .url()} 2x`}
                width={540}
                height={588}
              />
              <source
                media={`(min-width: ${screens.sm}px)`}
                srcSet={`${urlFor(copySection.image)
                  .size(980, 300)
                  .fit('crop')
                  .auto('format')
                  .url()}, ${urlFor(copySection.image)
                  .size(980, 300)
                  .fit('crop')
                  .auto('format')
                  .dpr(2)
                  .url()} 2x`}
              />
              <img
                srcSet={`${urlFor(copySection.image)
                  .size(327, 300)
                  .auto('format')
                  .fit('crop')
                  .url()}, 
                  ${urlFor(copySection.image)
                    .size(327, 300)
                    .auto('format')
                    .fit('crop')
                    .dpr(2)
                    .url()} 2x`}
                src={urlFor(copySection.image)
                  .size(327, 300)
                  .auto('format')
                  .fit('crop')
                  .url()}
                alt={copySection.image.altText ?? ''}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover lg:h-auto lg:w-auto lg:object-none"
              />
            </picture>
          </div>
          <div className="max-w-xl text-center lg:basis-1/2 lg:text-left">
            <PortableText
              value={copySection.title}
              components={{
                block: {
                  normal: ({ children }) => (
                    <h2 className="mb-8 text-3xl font-bold uppercase leading-none tracking-wide sm:text-5xl">
                      {children}
                    </h2>
                  ),
                },
                marks: {
                  em: ({ children }) => (
                    <em className="not-italic text-orange-500">{children}</em>
                  ),
                },
              }}
            />
            <PortableText
              value={copySection.copy}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="font-medium text-black/50">{children}</p>
                  ),
                },
              }}
            />
          </div>
        </div>
      </CenterContent>
    </div>
  )
}
