import { productZod, productCategoryZod } from '@audiophile/content-schema'
import { BackButton } from '~/components/BackButton'
import { sanityClient, urlFor } from '~/sanityClient'
import { z } from 'zod'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { CenterContent } from '~/components/CenterContent'
import { ChevronRightIcon } from '~/components/icons'
import { screens } from 'tailwind.config'
import clsx from 'clsx'

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const productPromise = sanityClient
    .fetch(
      `*[_type == "product" && slug.current == "${params.slug}"]{
      title,
      mainImage,
      isNew,
      description,
      'price': {
        'amount': price.amount,
        'currencyCode' : price.currency->isoCode
      },
      features,
      boxIncludes,
      gallery[0..2],
      relatedProducts[]->{title, 'slug': slug.current, shortTitle, thumbnailImage}
  }[0]`
    )
    .then((result) =>
      productZod
        .pick({
          title: true,
          mainImage: true,
          isNew: true,
          description: true,
          features: true,
          boxIncludes: true,
          gallery: true,
        })
        .extend({
          price: z.object({
            amount: productZod.shape.price.shape.amount,
            currencyCode: productZod.shape.price.shape.currency.shape.isoCode,
          }),
          relatedProducts: z.array(
            productZod.shape.relatedProducts.element
              .pick({
                title: true,
                shortTitle: true,
                thumbnailImage: true,
              })
              .extend({
                slug: productZod.shape.relatedProducts.element.shape.slug.shape
                  .current,
              })
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

  const [product, productCategories] = await Promise.all([
    productPromise,
    productCategoriesPromise,
  ])

  return (
    <div className="mb-32 lg:mb-40">
      <CenterContent>
        <div className="pb-6 pt-4 sm:pt-8 lg:pb-14 lg:pt-20">
          <BackButton className="font-medium leading-relaxed text-black/50">
            Go Back
          </BackButton>
        </div>
        <div className="flex flex-col gap-32 lg:gap-40">
          <div className="flex flex-col gap-20">
            <div className="grid gap-8 sm:grid-cols-[2fr_3fr] sm:items-center sm:gap-16 lg:grid-cols-2 lg:gap-32">
              <div className="overflow-hidden rounded-lg">
                <picture>
                  {product.mainImage.desktop && (
                    <source
                      media={`(min-width: ${screens.lg}px)`}
                      srcSet={`
                        ${urlFor(product.mainImage.desktop)
                          .width(540)
                          .height(560)
                          .url()},
                        ${urlFor(product.mainImage.desktop)
                          .width(1080)
                          .height(1120)
                          .url()} 2x`}
                      width={1080}
                      height={1120}
                    />
                  )}
                  {product.mainImage.tablet && (
                    <source
                      media={`(min-width: ${screens.sm}px)`}
                      srcSet={`
                        ${urlFor(product.mainImage.tablet)
                          .width(281)
                          .height(480)
                          .url()},
                      , ${urlFor(product.mainImage.tablet)
                        .width(562)
                        .height(960)
                        .url()} 2x`}
                      width={562}
                      height={960}
                    />
                  )}
                  <img
                    srcSet={`${urlFor(product.mainImage.mobile)
                      .width(327)
                      .height(327)
                      .url()}, ${urlFor(product.mainImage.mobile)
                      .width(654)
                      .height(654)
                      .url()} 2x`}
                    alt={product.mainImage.alt}
                    width={654}
                    height={654}
                    loading="eager"
                    decoding="sync"
                  />
                </picture>
              </div>
              <div className="flex flex-col gap-8 lg:gap-12">
                <div className="flex max-w-md flex-col gap-6 sm:gap-8">
                  <hgroup className="flex flex-col gap-6 sm:gap-4">
                    {product.isNew && (
                      <p className="text-sm uppercase tracking-[0.7em] text-orange-500">
                        New product
                      </p>
                    )}
                    <h1 className="text-2xl font-bold uppercase leading-snug tracking-wider sm:text-3xl lg:text-[2.5rem] lg:leading-[1.1]">
                      {product.title}
                    </h1>
                  </hgroup>
                  <p className="text-medium leading-relaxed text-black/50">
                    {product.description}
                  </p>
                  {/* TODO: put a space between the symbol and the amount */}
                  <p className="text-lg font-bold tracking-wider">
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: product.price.currencyCode,
                      currencyDisplay: 'narrowSymbol',
                    }).format(product.price.amount)}
                  </p>
                </div>
                <form className="flex gap-4">
                  <input
                    type="number"
                    aria-label="quantity"
                    className="w-0 basis-32 bg-gray-100"
                  />
                  <button
                    type="submit"
                    className="whitespace-nowrap bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
                  >
                    Add to Cart
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:flex lg:items-start lg:gap-32">
              <div className="flex flex-col gap-6 sm:gap-8 lg:flex-1 lg:basis-1/2">
                <h2 className="text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                  Features
                </h2>
                <div className="flex flex-col gap-6">
                  <PortableText
                    value={product.features}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="leading-relaxed text-black/50">
                            {children}
                          </p>
                        ),
                      },
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:flex-1 lg:basis-80 lg:grid-cols-1 lg:gap-8">
                <h2 className="text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                  In the box
                </h2>
                <ul className="flex flex-col gap-2">
                  {product.boxIncludes.map(({ _key, item, quantity }) => (
                    <li key={_key} className="flex leading-relaxed">
                      <span className="basis-10 font-bold text-orange-500">
                        {quantity}x
                      </span>
                      <span className="font-medium text-black/50">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-flow-col sm:grid-cols-[4fr_5fr] sm:grid-rows-[repeat(2,25vw)]">
              {product.gallery.map((image, index) => (
                <div
                  key={index}
                  className={clsx('overflow-hidden rounded-lg', {
                    'sm:row-span-2': index === 2,
                  })}
                >
                  <picture className="h-full w-full object-cover">
                    {image.tablet && (
                      <source
                        media={`(min-width: ${screens.sm}px)`}
                        srcSet={`
                        ${urlFor(image.tablet)
                          .width(index === 2 ? 395 : 277)
                          .height(index === 2 ? 368 : 172)
                          .url()}, 
                        ${urlFor(image.tablet)
                          .width(index === 2 ? 790 : 554)
                          .height(index === 2 ? 736 : 348)
                          .url()} 2x`}
                        width={index === 2 ? 790 : 554}
                        height={index === 2 ? 736 : 348}
                      />
                    )}
                    <img
                      srcSet={`${urlFor(image.mobile)
                        .width(327)
                        .height(index === 2 ? 368 : 174)
                        .url()}, ${urlFor(image.mobile)
                        .width(654)
                        .height(index === 2 ? 736 : 358)
                        .url()} 2x`}
                      src={urlFor(image.mobile)
                        .width(654)
                        .height(index === 2 ? 736 : 348)
                        .url()}
                      alt={image.alt}
                      width={654}
                      height={index === 2 ? 736 : 348}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-10 sm:gap-14">
            <h2 className="text-center text-2xl font-bold uppercase tracking-wide sm:text-3xl">
              You may also like
            </h2>
            <ul className="flex flex-col gap-14 sm:flex-row sm:gap-3">
              {product.relatedProducts.map(
                ({ slug, title, shortTitle, thumbnailImage }) => (
                  <li
                    key={slug}
                    className="flex flex-1 flex-col items-center gap-8"
                  >
                    {thumbnailImage && (
                      <picture>
                        {thumbnailImage.tablet && (
                          <source
                            media={`(min-width: ${screens.sm}px)`}
                            srcSet={`${urlFor(thumbnailImage.tablet)
                              .width(223)
                              .height(318)
                              .url()}, 
                            ${urlFor(thumbnailImage.tablet)
                              .width(446)
                              .height(636)
                              .url()} 2x}`}
                            width={446}
                            height={636}
                          />
                        )}
                        <img
                          srcSet={`${urlFor(thumbnailImage.mobile)
                            .width(357)
                            .height(120)
                            .url()}, ${urlFor(thumbnailImage.mobile)
                            .width(654)
                            .height(240)
                            .url()} 2x`}
                          src={urlFor(thumbnailImage.mobile)
                            .width(654)
                            .height(240)
                            .url()}
                          alt={thumbnailImage.alt}
                          width={654}
                          height={240}
                          loading="lazy"
                          decoding="async"
                          className="rounded-lg"
                        />
                      </picture>
                    )}
                    <p
                      className="text-2xl font-bold tracking-[0.07em]"
                      id={slug}
                    >
                      {shortTitle ?? title}
                    </p>
                    <Link
                      href={`/product/${slug}`}
                      id={`${slug}-link`}
                      aria-labelledby={`${slug}-link ${slug}`}
                      className="whitespace-nowrap bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
                    >
                      See product
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
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
