import Link from 'next/link'
import { CenterContent } from '~/components/CenterContent'
import { sanityClient, urlFor } from '~/sanityClient'
import { z } from 'zod'
import { productCategoryZod, productZod } from '@audiophile/content-schema'

import { screens } from 'tailwind.config'
import { ChevronRightIcon } from '~/components/icons'

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const productCategoryPromise = sanityClient
    .fetch(
      `*[_type == "productCategory" && slug.current == "${params.categorySlug}"]{
        title,
        "products": *[_type == "product" && references(^._id)] | order(order asc)[] {
          title,
          description,
          isNew,
          "slug": slug.current,
          previewImage
        }
      }[0]`
    )
    .then((result) =>
      productCategoryZod
        .pick({ title: true })
        .extend({
          products: z.array(
            productZod
              .pick({
                title: true,
                isNew: true,
                description: true,
                previewImage: true,
              })
              .extend({ slug: productZod.shape.slug.shape.current })
          ),
        })
        .parse(result)
    )

  const productCategoriesPromise = sanityClient
    .fetch(
      `*[_type == "productCategory"] | order(order asc)[]{title, "slug": slug.current, thumbnail}`
    )
    .then((result) =>
      z
        .array(
          productCategoryZod.pick({ title: true, thumbnail: true }).extend({
            slug: productCategoryZod.shape.slug.shape.current,
          })
        )
        .parse(result)
    )

  const [productCategory, productCategories] = await Promise.all([
    productCategoryPromise,
    productCategoriesPromise,
  ])

  return (
    <div>
      <div className="bg-black py-8 text-white sm:py-24">
        <h1 className="text-center text-3xl font-bold uppercase tracking-widest">
          {productCategory.title}
        </h1>
      </div>
      <CenterContent>
        <div className="flex flex-col gap-32 py-16 sm:py-32">
          {productCategory.products.map((product, index) => (
            <div
              key={product.slug}
              className="flex flex-col items-center gap-8 sm:gap-14 lg:gap-32 odd:lg:flex-row even:lg:flex-row-reverse"
            >
              <div className="overflow-hidden rounded-lg lg:basis-1/2">
                <picture>
                  {product.previewImage.desktop && (
                    <source
                      media={`(min-width: ${screens.lg}px)`}
                      srcSet={`${urlFor(product.previewImage.desktop)
                        .width(540)
                        .height(560)
                        .url()}, ${urlFor(product.previewImage.desktop)
                        .width(1080)
                        .height(1120)
                        .url()} 2x`}
                      width={1080}
                      height={1120}
                    />
                  )}
                  {product.previewImage.tablet && (
                    <source
                      media={`(min-width: ${screens.sm}px)`}
                      srcSet={`${urlFor(product.previewImage.tablet)
                        .width(689)
                        .height(352)
                        .url()}, ${urlFor(product.previewImage.tablet)
                        .width(1378)
                        .height(704)
                        .url()} 2x`}
                      width={1378}
                      height={704}
                    />
                  )}
                  <img
                    srcSet={`${urlFor(product.previewImage.mobile)
                      .width(327)
                      .height(352)
                      .url()}, ${urlFor(product.previewImage.mobile)
                      .width(654)
                      .height(704)
                      .url()} 2x`}
                    src={urlFor(product.previewImage.mobile)
                      .width(327)
                      .height(352)
                      .url()}
                    alt={product.previewImage.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    width={654}
                    height={704}
                  />
                </picture>
              </div>
              <div className="flex max-w-xl flex-col items-center gap-6 text-center sm:gap-0 lg:basis-1/2 lg:items-start lg:text-left">
                {product.isNew && (
                  <p className="text-sm uppercase tracking-[0.7em] text-orange-500 sm:mb-4">
                    New product
                  </p>
                )}
                <h2
                  id={product.slug}
                  className="text-3xl font-bold uppercase tracking-[0.03em] sm:mb-8 sm:text-4xl"
                >
                  {product.title}
                </h2>
                <p className="font-medium leading-relaxed text-black/50 sm:mb-6 lg:mb-10">
                  {product.description}
                </p>
                <Link
                  id={`${product.slug}-link`}
                  href={`/product/${product.slug}`}
                  aria-labelledby={`${product.slug}-link ${product.slug}`}
                  className="bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
                >
                  See product
                </Link>
              </div>
            </div>
          ))}
          <ul className="flex flex-col sm:flex-row sm:gap-3 lg:gap-8">
            {productCategories.map(({ slug, title, thumbnail }) => (
              <li
                key={slug}
                className="relative isolate flex flex-1 flex-col items-center p-5 before:absolute before:inset-0 before:top-1/4 before:-z-10 before:rounded-lg before:bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  srcSet={`${urlFor(thumbnail.mobile).width(128).url()}, 
                            ${urlFor(thumbnail.mobile).width(256).url()} 2x,
                            `}
                  src={urlFor(thumbnail.mobile).width(128).url()}
                  alt=""
                  width={438}
                  height={438}
                  className="aspect-square max-w-[8rem] object-contain object-bottom"
                  loading="lazy"
                  decoding="async"
                />
                <p
                  id={`${slug}-main-link-description`}
                  className="mb-4 font-bold uppercase tracking-wider"
                >
                  {title}
                </p>
                <Link
                  href={slug}
                  id={`${slug}-main-link`}
                  aria-labelledby={`${slug}-main-link ${slug}-main-link-description`}
                  className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black/50 before:absolute before:inset-0 before:cursor-pointer"
                >
                  Shop
                  <ChevronRightIcon className="w-2 text-orange-500" />
                </Link>
              </li>
            ))}
          </ul>
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
