import { productZod } from '@audiophile/content-schema'
import { BackButton } from '~/components/BackButton'
import { sanityClient, urlFor } from '~/sanityClient'
import { z } from 'zod'
import { PortableText } from '@portabletext/react'

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
      boxIncludes
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
    </div>
  )
}
