import { productZod } from '@audiophile/content-schema'
import { BackButton } from '~/components/BackButton'
import { sanityClient, urlFor } from '~/sanityClient'
import { z } from 'zod'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await sanityClient
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

  return (
    <div>
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
    </div>
  )
}
