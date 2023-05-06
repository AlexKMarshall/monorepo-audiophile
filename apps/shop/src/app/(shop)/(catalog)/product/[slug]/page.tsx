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
    <div>
      <CenterContent>
        <BackButton>Go Back</BackButton>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>
          {new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: product.price.currencyCode,
            currencyDisplay: 'narrowSymbol',
          }).format(product.price.amount)}
        </p>
        <form>
          <input type="number" aria-label="quantity" />
          <button type="submit">Add to Cart</button>
        </form>
        <h2>Features</h2>
        <PortableText value={product.features} />
        <h2>In the box</h2>
        <ul>
          {product.boxIncludes.map(({ _key, item, quantity }) => (
            <li key={_key}>
              <span>{quantity}x</span> <span>{item}</span>
            </li>
          ))}
        </ul>
        <h2>You may also like</h2>
        <ul>
          {product.relatedProducts.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/product/${slug}`}>{title}</Link>
            </li>
          ))}
        </ul>
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
      </CenterContent>
    </div>
  )
}
