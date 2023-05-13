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
import { BackButton } from '~/components/BackButton'
import { formatCurrency } from '~/currency'

export default async function CartPage() {
  const cart = getCartFromCookies()

  const productIds = Object.keys(cart)

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
    revalidatePath('/cart')
    return redirect('/checkout')
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function removeAll() {
    'use server'

    updateCartCookie({})

    revalidatePath('/')
    revalidatePath('/cart')
  }

  const cartItemsCount = products.length

  if (cartItemsCount === 0) {
    return (
      <div>
        <h1>Cart Empty</h1>
      </div>
    )
  }

  return (
    <div className="mb-24 sm:mb-28 lg:mb-36">
      <CenterContent>
        <div className="pb-6 pt-4 sm:pt-8 lg:pb-14 lg:pt-20">
          <BackButton className="font-medium leading-relaxed text-black/50">
            Go Back
          </BackButton>
        </div>
        <form
          className="mx-auto flex max-w-2xl flex-col gap-8 rounded-lg bg-white px-6 py-8"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          action={checkout}
          aria-labelledby="cart-form-heading"
        >
          <div className="flex items-center justify-between">
            <h1
              id="cart-form-heading"
              className="text-lg font-bold uppercase tracking-[0.04em]"
            >
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
                    {product.shortestTitle ??
                      product.shortTitle ??
                      product.title}
                  </p>
                  <p className="text-sm font-bold text-black/50">
                    {formatCurrency({
                      currencyCode: product.price.currencyCode,
                      amount: product.price.amount,
                    })}
                  </p>
                </div>
                <QuantityInput
                  className="ml-auto w-0 basis-24 bg-gray-100 py-2 text-center"
                  defaultValue={cart[product._id]}
                  name={product._id}
                  aria-label="Quantity"
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-6">
            <dl>
              <div
                className="flex items-center justify-between"
                data-testId="cart-summary-item"
              >
                <dt className="text-[15px] font-medium uppercase text-black/50">
                  Total
                </dt>
                <dd className="text-lg font-bold">
                  {formatCurrency({
                    currencyCode: cartCurrency,
                    amount: cartTotal,
                  })}
                </dd>
              </div>
            </dl>
            <button
              type="submit"
              className="bg-orange-500 py-4 text-[13px] font-bold uppercase tracking-[0.07em] text-white"
            >
              Checkout
            </button>
          </div>
        </form>
      </CenterContent>
    </div>
  )
}
