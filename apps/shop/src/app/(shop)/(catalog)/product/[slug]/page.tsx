import { productZod, productCategoryZod } from '@audiophile/content-schema'
import { BackButton } from '~/components/BackButton'
import { urlFor } from '~/sanityClient'
import { z } from 'zod'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { CenterContent } from '~/components/CenterContent'
import { ChevronRightIcon } from '~/components/icons'
import { screens } from 'tailwind.config'
import clsx from 'clsx'
import {
  sanityImageCropZodSchema,
  sanityImageHotspotZodSchema,
  sanityImageSourceZodSchema,
} from '@audiophile/content-schema/image'
import { fetchQuery } from '~/contentClient'
import { cartReducer, getCartFromCookies, updateCartCookie } from '~/cart'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { formatCurrency } from '~/currency'

const userIdCookieName = 'audiophile-user-id'

function getOrCreateUserId() {
  const existingUserId = cookies().get(userIdCookieName)?.value
  if (existingUserId) return existingUserId

  const newUserId = randomUUID()
  // @ts-expect-error - NextJS types are wrong
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cookies().set(userIdCookieName, newUserId)
  return newUserId
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const productPromise = fetchQuery({
    query: `*[_type == "product" && slug.current == $slug]{
      _id,
      title,
      'mainImageNew': {...mainImageNew, 'altText': mainImageNew.asset->altText},
      isNew,
      description,
      'price': {
        'amount': price.amount,
        'currencyCode' : price.currency->isoCode
      },
      features,
      boxIncludes,
      'galleryNew': galleryNew[0...3]{..., 'altText': asset->altText},   
      relatedProducts[]->{title, 
        'slug': slug.current, 
        shortTitle, 
        'thumbnailImageNew': {...thumbnailImageNew, 'altText': thumbnailImageNew.asset->altText}}
  }[0]`,
    params: { slug: params.slug },
    validationSchema: productZod
      .pick({
        _id: true,
        title: true,
        isNew: true,
        description: true,
        features: true,
        boxIncludes: true,
      })
      .extend({
        mainImageNew: productZod.shape.mainImageNew.extend({
          altText: z.string().nullable(),
        }),
        galleryNew: z.array(
          sanityImageSourceZodSchema.extend({
            hotspot: sanityImageHotspotZodSchema,
            crop: sanityImageCropZodSchema,
            altText: z.string().nullable(),
          })
        ),
        price: z.object({
          amount: productZod.shape.price.shape.amount,
          currencyCode: productZod.shape.price.shape.currency.shape.isoCode,
        }),
        relatedProducts: z.array(
          productZod.shape.relatedProducts.element
            .pick({
              title: true,
              shortTitle: true,
            })
            .extend({
              slug: productZod.shape.relatedProducts.element.shape.slug.shape
                .current,
              thumbnailImageNew:
                productZod.shape.relatedProducts.element.shape.thumbnailImageNew.extend(
                  {
                    altText: z.string().nullable(),
                  }
                ),
            })
        ),
      }),
  })

  const productCategoriesPromise = fetchQuery({
    query: `*[_type == "productCategory"] | order(order asc)[]{title, "slug": slug.current, thumbnailNew}`,
    validationSchema: z.array(
      productCategoryZod.pick({ title: true, thumbnailNew: true }).extend({
        slug: productCategoryZod.shape.slug.shape.current,
      })
    ),
  })

  const [{ result: product }, { result: productCategories }] =
    await Promise.all([productPromise, productCategoriesPromise])

  // server actions have to be async
  // eslint-disable-next-line @typescript-eslint/require-await
  async function addToCart(data: FormData) {
    'use server'

    const userId = getOrCreateUserId()

    const cart = getCartFromCookies()
    const productId = product._id
    const quantity = z
      .preprocess((val) => Number(val), z.number().min(1))
      .parse(data.get('quantity'))

    const updatedCart = cartReducer(cart, { type: 'add', productId, quantity })

    updateCartCookie(updatedCart)
    revalidatePath('/')
    revalidatePath('/cart')
  }

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
              <div className="grid aspect-square place-items-center overflow-hidden rounded-lg bg-gray-100 sm:aspect-[7/12] lg:aspect-[27/28]">
                <img
                  className="max-w-[70%] sm:max-w-[80%]"
                  sizes={`(min-width: ${screens.lg}px) 500w, (min-width: ${screens.sm}px) 40vw, 80vw`}
                  srcSet={[300, 400, 600, 800, 1000]
                    .map(
                      (size) =>
                        `${urlFor(product.mainImageNew)
                          .size(size, size)
                          .fit('fill')
                          .bg('f1f1f1')
                          .ignoreImageParams()
                          .auto('format')
                          .sharpen(20)
                          .url()} ${size}w`
                    )
                    .join(', ')}
                  src={urlFor(product.mainImageNew)
                    .size(400, 400)
                    .fit('fill')
                    .bg('f1f1f1')
                    .ignoreImageParams()
                    .auto('format')
                    .sharpen(20)
                    .url()}
                  decoding="sync"
                  loading="eager"
                  alt={product.mainImageNew.altText ?? ''}
                />
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
                    {formatCurrency({
                      currencyCode: product.price.currencyCode,
                      amount: product.price.amount,
                    })}
                  </p>
                </div>
                {/* TODO: React typings haven't caught up yet with server actions */}
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form action={addToCart} className="flex gap-4">
                  <input
                    name="quantity"
                    defaultValue={1}
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
            <div className="grid gap-5 sm:grid-flow-col sm:grid-cols-[4fr_5fr] sm:grid-rows-[repeat(2,25vw)] lg:grid-cols-[2fr_3fr] lg:grid-rows-[repeat(2,20vw)]">
              {product.galleryNew.map((image, index) => (
                <div
                  key={index}
                  className={clsx('overflow-hidden rounded-lg', {
                    'sm:row-span-2': index === 2,
                  })}
                >
                  <picture className="h-full w-full object-cover">
                    <source
                      media={`(min-width: ${screens.lg}px)`}
                      srcSet={`
                        ${urlFor(image)
                          .width(index === 2 ? 317 : 223)
                          .height(index === 2 ? 296 : 140)
                          .auto('format')
                          .url()}, 
                        ${urlFor(image)
                          .width(index === 2 ? 635 : 445)
                          .height(index === 2 ? 592 : 280)
                          .auto('format')
                          .url()} 2x`}
                      width={index === 2 ? 635 : 445}
                      height={index === 2 ? 592 : 280}
                    />
                    <source
                      media={`(min-width: ${screens.sm}px)`}
                      srcSet={`
                        ${urlFor(image)
                          .width(index === 2 ? 395 : 277)
                          .height(index === 2 ? 368 : 172)
                          .auto('format')
                          .url()}, 
                        ${urlFor(image)
                          .width(index === 2 ? 790 : 554)
                          .height(index === 2 ? 736 : 348)
                          .auto('format')
                          .url()} 2x`}
                      width={index === 2 ? 790 : 554}
                      height={index === 2 ? 736 : 348}
                    />
                    <img
                      srcSet={`${urlFor(image)
                        .width(327)
                        .height(index === 2 ? 368 : 174)
                        .auto('format')
                        .url()}, ${urlFor(image)
                        .width(654)
                        .height(index === 2 ? 736 : 358)
                        .auto('format')
                        .url()} 2x`}
                      src={urlFor(image)
                        .width(654)
                        .height(index === 2 ? 736 : 348)
                        .auto('format')
                        .url()}
                      alt={image.altText ?? ''}
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
                ({ slug, title, shortTitle, thumbnailImageNew }) => (
                  <li
                    key={slug}
                    className="flex flex-1 flex-col items-center gap-8"
                  >
                    <div className="grid max-w-full place-items-center self-stretch rounded-lg bg-gray-100 py-3 sm:py-14">
                      <img
                        sizes={`(min-width: ${screens.sm}px) 190px, 95px`}
                        srcSet={[95, 190, 380]
                          .map(
                            (size) =>
                              `${urlFor(thumbnailImageNew)
                                .size(size, size)
                                .fit('fill')
                                .bg('f1f1f1')
                                .ignoreImageParams()
                                .auto('format')
                                .url()} ${size}w`
                          )
                          .join(', ')}
                        src={urlFor(thumbnailImageNew)
                          .size(95, 95)
                          .fit('fill')
                          .bg('f1f1f1')
                          .ignoreImageParams()
                          .auto('format')
                          .url()}
                        alt={thumbnailImageNew.altText ?? ''}
                        loading="lazy"
                        decoding="async"
                        className="max-w-[90%]"
                      />
                    </div>
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
            {productCategories.map(({ slug, title, thumbnailNew }) => (
              <li
                key={slug}
                className="relative isolate flex flex-1 flex-col items-center p-5 before:absolute before:inset-0 before:top-1/4 before:-z-10 before:rounded-lg before:bg-gray-100"
              >
                <img
                  srcSet={`${urlFor(thumbnailNew).width(128).url()}, 
                            ${urlFor(thumbnailNew).width(128).dpr(2).url()} 2x,
                            `}
                  src={urlFor(thumbnailNew).width(128).url()}
                  alt=""
                  width={128}
                  height={128}
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

// Not working with server actions

// export async function generateStaticParams() {
//   const { result: slugs } = await fetchQuery({
//     query: `*[_type == "product"].slug.current`,
//     validationSchema: z.array(productZod.shape.slug.shape.current),
//   })

//   return slugs.map((slug) => ({ slug }))
// }
