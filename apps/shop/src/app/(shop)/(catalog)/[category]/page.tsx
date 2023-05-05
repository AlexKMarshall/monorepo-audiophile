import Image from 'next/image'
import Link from 'next/link'
import { CenterContent } from '~/components/CenterContent'
import { sanityClient } from '~/sanityClient'
import { z } from 'zod'
import { productCategoryZod } from '@audiophile/content-schema'

import xx99MarkTwoPreviewMobile from './xx99-mk2-image-category-page-preview-mobile.jpg'
import xx99MarkTwoPreviewTablet from './xx99-mk2-image-category-page-preview-tablet.jpg'
import xx99MarkTwoPreviewDesktop from './xx99-mk2-image-category-page-preview-desktop.jpg'

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const productCategory = await sanityClient
    .fetch(
      `*[_type == "productCategory" && slug.current == "${params.category}"]{title}[0]`
    )
    .then((result) => productCategoryZod.pick({ title: true }).parse(result))

  return (
    <div>
      <div className="bg-black py-8 text-white sm:py-24">
        <h1 className="text-center text-3xl font-bold uppercase tracking-widest">
          {productCategory.title}
        </h1>
      </div>
      <CenterContent>
        <div className="flex flex-col gap-32 py-16 sm:py-32">
          <div className="flex flex-col items-center gap-8 sm:gap-14 lg:flex-row lg:gap-32">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={xx99MarkTwoPreviewDesktop}
                alt="Black over ear headphones with gloss finish"
                className="hidden lg:block"
              />
              <Image
                src={xx99MarkTwoPreviewTablet}
                alt="Black over ear headphones with gloss finish"
                className="hidden sm:block lg:hidden"
              />
              <Image
                src={xx99MarkTwoPreviewMobile}
                alt="Black over ear headphones with gloss finish"
                className="sm:hidden"
              />
            </div>
            <div className="flex max-w-xl flex-col items-center gap-6 text-center sm:gap-0 lg:items-start lg:text-left">
              <p className="text-sm uppercase tracking-[0.7em] text-orange-500 sm:mb-4">
                New product
              </p>
              <h2
                id="xx99-mark-two-headphones"
                className="text-3xl font-bold uppercase tracking-[0.03em] sm:mb-8 sm:text-4xl"
              >
                XX99 Mark II Headphones
              </h2>
              <p className="font-medium leading-relaxed text-black/50 sm:mb-6 lg:mb-10">
                The new XX99 Mark II headphones is the pinnacle of pristine
                audio. It redefines your premium headphone experience by
                reproducing the balanced depth and precision of studio-quality
                sound.
              </p>
              <Link
                id="xx99-mark-two-headphones-link"
                href="/product/xx99-mark-two-headphones"
                aria-labelledby="xx99-mark-two-headphones-link xx99-mark-two-headphones"
                className="bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
              >
                See product
              </Link>
            </div>
          </div>
        </div>
      </CenterContent>
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await sanityClient
    .fetch(`*[_type == "productCategory"] | order(order asc)[].slug.current`)
    .then((result) =>
      z.array(productCategoryZod.shape.slug.shape.current).parse(result)
    )

  return slugs.map((slug) => ({ category: slug }))
}
