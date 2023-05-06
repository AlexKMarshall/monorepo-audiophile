import { productZod, productCategoryZod } from '@audiophile/content-schema'
import { BackButton } from '~/components/BackButton'
import { sanityClient, urlFor } from '~/sanityClient'
import { z } from 'zod'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { CenterContent } from '~/components/CenterContent'
import { ChevronRightIcon } from '~/components/icons'

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
      relatedProducts[]->{title, 'slug': slug.current}
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
    <div className="mb-32">
      <CenterContent>
        <div className="pb-6 pt-4">
          <BackButton className="font-medium leading-relaxed text-black/50">
            Go Back
          </BackButton>
        </div>
        <div className="flex flex-col gap-32">
          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-8">
              <div className="overflow-hidden rounded-lg">
                <picture>
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
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  {product.isNew && (
                    <p className="text-sm uppercase tracking-[0.7em] text-orange-500">
                      New product
                    </p>
                  )}
                  <h1 className="text-2xl font-bold uppercase leading-snug tracking-wider">
                    {product.title}
                  </h1>
                  <p>{product.description}</p>
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
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                Features
              </h2>
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
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold uppercase tracking-wide">
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
          <div>
            <h2>You may also like</h2>
            <ul>
              {product.relatedProducts.map(({ slug, title }) => (
                <li key={slug}>
                  <Link href={`/product/${slug}`}>{title}</Link>
                </li>
              ))}
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
