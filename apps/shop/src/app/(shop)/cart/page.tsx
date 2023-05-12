import {
  cartReducer,
  cartSchema,
  getCartFromCookies,
  updateCartCookie,
} from '~/cart'
import { fetchQuery } from '~/contentClient'
import { z } from 'zod'
import { productZod } from '@audiophile/content-schema'
import { urlFor } from '~/sanityClient'
import { CenterContent } from '~/components/CenterContent'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { QuantityInput } from './QuantityInput'

export default async function CartPage() {
  const cart = getCartFromCookies()

  const productIds = Object.keys(cart)
  const cartItemsCount = productIds.length

  if (cartItemsCount === 0) {
    return <div>Empty cart</div>
  }

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

  const cartTotal = products.reduce(
    (total, product) => total + product.price.amount * (cart[product._id] ?? 0),
    0
  )

  const cartCurrency = products[0]?.price.currencyCode ?? 'USD'

  // eslint-disable-next-line @typescript-eslint/require-await
  async function checkout(data: FormData) {
    'use server'

    const cart = getCartFromCookies()

    const cartRequest = cartSchema.parse(Object.fromEntries(data.entries()))
    const updatedCart = cartReducer(cart, {
      type: 'replace',
      cart: cartRequest,
    })

    updateCartCookie(updatedCart)

    revalidatePath('/')
    return redirect('/checkout')
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function removeAll() {
    'use server'

    updateCartCookie({})

    revalidatePath('/')
  }

  return (
    <CenterContent>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="flex flex-col gap-8 py-12" action={checkout}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold uppercase tracking-[0.04em]">
            Cart ({cartItemsCount})
          </h1>
          <button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            formAction={removeAll}
            className="text-[15px] font-medium text-black/50 underline"
          >
            Remove all
          </button>
        </div>
        <ul className="flex flex-col gap-6">
          {products.map((product) => (
            <li key={product._id} className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gray-100">
                <img
                  srcSet={`
                          ${urlFor(product.thumbnailImageNew)
                            .size(40, 40)
                            .fit('fill')
                            .bg('f1f1f1')
                            .ignoreImageParams()
                            .auto('format')
                            .sharpen(20)
                            .url()} 1x,
                          ${urlFor(product.thumbnailImageNew)
                            .size(40, 40)
                            .fit('fill')
                            .bg('f1f1f1')
                            .ignoreImageParams()
                            .auto('format')
                            .sharpen(20)
                            .dpr(2)
                            .url()} 2x
                        `}
                  src={urlFor(product.thumbnailImageNew)
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
              <div>
                <p className="text-[15px] font-bold uppercase leading-relaxed">
                  {product.shortestTitle ?? product.shortTitle ?? product.title}
                </p>
                <p className="text-sm font-bold text-black/50">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: product.price.currencyCode,
                    currencyDisplay: 'narrowSymbol',
                  }).format(product.price.amount)}
                </p>
              </div>
              <QuantityInput
                className="ml-auto w-0 basis-24 bg-gray-100 py-2 text-center"
                defaultValue={cart[product._id]}
                name={product._id}
              />
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-6">
          <h3 className="flex items-center justify-between">
            <span className="text-[15px] font-medium uppercase text-black/50">
              Total
            </span>
            <span className="text-lg font-bold">
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: cartCurrency,
                currencyDisplay: 'narrowSymbol',
              }).format(cartTotal)}
            </span>
          </h3>
          <button
            type="submit"
            className="bg-orange-500 py-4 text-[13px] font-bold uppercase tracking-[0.07em] text-white"
          >
            Checkout
          </button>
        </div>
      </form>
    </CenterContent>
  )
}
