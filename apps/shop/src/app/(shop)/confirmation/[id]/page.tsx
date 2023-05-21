import { productZod } from '@audiophile/content-schema'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { getOrder, getUserId } from '~/cart'
import { CenterContent } from '~/components/CenterContent'
import { Svg } from '~/components/Svg'
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
    <div className="mb-24 mt-16 sm:mb-28 lg:mb-36">
      <CenterContent>
        <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-lg bg-white p-8 sm:gap-8 sm:p-12">
          <CheckMarkIcon className="h-16 w-16 text-orange-500" />
          <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-2xl font-bold uppercase leading-7 tracking-[0.04em] sm:text-[32px] sm:leading-9">
              Thank you
              <br /> for your order
            </h1>
            <p className="text-[15px] font-medium leading-relaxed text-black/50">
              You will receive an email confirmation shortly.
            </p>
          </div>
          <div className="flex flex-col overflow-hidden rounded-lg sm:flex-row">
            <div className="flex flex-1 flex-col gap-3 bg-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gray-100">
                  <img
                    srcSet={` ${urlFor(firstItem.product.thumbnailImageNew)
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
                        .url()} 2x`}
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
              {restItems.length > 0 && (
                <>
                  <div className="h-[1px] bg-black/10" />
                  <p className="text-center text-xs font-bold tracking-tight text-black/50">
                    and {restItems.length} other item(s)
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 bg-black px-6 pb-5 pt-4">
              <h2 className="text-[15px] font-medium uppercase leading-relaxed text-white/50">
                Grand total
              </h2>
              <p className="text-lg font-bold text-white">
                {formatCurrency({
                  amount: enrichedOrder.grandTotal,
                  currencyCode: enrichedOrder.currency,
                })}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block bg-orange-500 px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.07em] text-white sm:mt-4"
          >
            Back to home
          </Link>
        </div>
      </CenterContent>
    </div>
  )
}

function CheckMarkIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 64 64" className={className}>
      <g fillRule="evenodd" fill="none">
        <circle cx="32" cy="32" r="32" fill="currentColor" stroke="none" />
        <path
          stroke="#FFF"
          stroke-width="4"
          d="m20.754 33.333 6.751 6.751 15.804-15.803"
        />
      </g>
    </Svg>
  )
}
