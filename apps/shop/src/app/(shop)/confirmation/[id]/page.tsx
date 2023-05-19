import { productZod } from '@audiophile/content-schema'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { getOrder, getUserId } from '~/cart'
import { fetchQuery } from '~/contentClient'
import { formatCurrency } from '~/currency'
import { urlFor } from '~/sanityClient'

export default async function ConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const userId = await getUserId()
  const order = await getOrder({ userId, orderId: params.id })

  if (!order) return notFound()

  const productIds = order.items.map((item) => item.productId)

  const { result: products } = await fetchQuery({
    query: `*[_type == "product" && _id in $productIds]{title, _id, shortTitle, shortestTitle, thumbnailImageNew, 'price': {
        'amount': price.amount,
        'currencyCode' : price.currency->isoCode
      },}`,
    params: { productIds },
    validationSchema: z.array(
      productZod
        .pick({
          title: true,
          _id: true,
          thumbnailImageNew: true,
          shortTitle: true,
          shortestTitle: true,
        })
        .extend({
          price: z.object({
            amount: productZod.shape.price.shape.amount,
            currencyCode: productZod.shape.price.shape.currency.shape.isoCode,
          }),
        })
    ),
  })

  const orderTotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const shipping = 50
  const grandTotal = orderTotal + shipping

  const enrichedOrder = {
    ...order,
    items: order.items.map((item) => {
      const product = products.find((product) => product._id === item.productId)
      if (!product) throw new Error(`Product ${item.productId} not found`)

      return { ...item, product }
    }),
    total: orderTotal,
    shipping: 50,
    grandTotal,
  }

  const [firstItem, ...restItems] = enrichedOrder.items

  if (!firstItem) throw new Error('Order has no items')

  return (
    <div>
      <h1>Thank you for your order</h1>
      <p>You will receive an email confirmation shortly.</p>
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gray-100">
          <img
            srcSet={`
                              ${urlFor(firstItem.product.thumbnailImageNew)
                                .size(40, 40)
                                .fit('fill')
                                .bg('f1f1f1')
                                .ignoreImageParams()
                                .auto('format')
                                .sharpen(20)
                                .url()} 1x,
                              ${urlFor(firstItem.product.thumbnailImageNew)
                                .size(40, 40)
                                .fit('fill')
                                .bg('f1f1f1')
                                .ignoreImageParams()
                                .auto('format')
                                .sharpen(20)
                                .dpr(2)
                                .url()} 2x
                            `}
            src={urlFor(firstItem.product.thumbnailImageNew)
              .size(40, 40)
              .fit('fill')
              .bg('f1f1f1')
              .ignoreImageParams()
              .auto('format')
              .sharpen(20)
              .url()}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-1 items-baseline justify-between">
          <div>
            <p className="text-[15px] font-bold uppercase leading-relaxed">
              {firstItem.product.shortestTitle ??
                firstItem.product.shortTitle ??
                firstItem.product.title}
            </p>
            <p className="text-sm font-bold text-black/50">
              {formatCurrency({
                currencyCode: firstItem.product.price.currencyCode,
                amount: firstItem.product.price.amount,
              })}
            </p>
          </div>
          <p className="text-[15px] text-black/50">
            &times;{firstItem.quantity}
          </p>
        </div>
      </div>
      {restItems.length > 0 && <p>and {restItems.length} other item(s)</p>}
      <div>
        <h2>Grand total</h2>
        <p>
          {formatCurrency({
            amount: enrichedOrder.grandTotal,
            currencyCode: enrichedOrder.currency,
          })}
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-orange-500 px-6 py-4 text-[13px] font-bold uppercase tracking-[0.07em] text-white"
      >
        Back to home
      </Link>
    </div>
  )
}
