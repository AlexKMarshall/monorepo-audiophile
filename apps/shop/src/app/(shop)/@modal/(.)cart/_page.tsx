import { getCartFromCookies } from '~/cart'
import { fetchQuery } from '~/contentClient'
import { productZod } from '@audiophile/content-schema'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '~/components/Dialog'
import { CenterContent } from '~/components/CenterContent'
import { urlFor } from '~/sanityClient'
import { QuantityInput } from '../../cart/QuantityInput'
import { formatCurrency } from '~/currency'

// Next seems to have problems revalidating and refreshing with new data with intercepted routes

// export const revalidate = 0

export default async function CartModalPage() {
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

  // look for the fetched products, not the items in the cart cookie, as they may be invalid ids
  const cartItemsCount = products.length

  if (cartItemsCount === 0) {
    return (
      <Dialog>
        <DialogOverlay className="fixed inset-0 bg-black/50">
          <CenterContent>
            <DialogContent className="mt-24 max-h-full overflow-auto rounded-lg bg-white px-7 py-8">
              Empty cart
            </DialogContent>
          </CenterContent>
        </DialogOverlay>
      </Dialog>
    )
  }

  const cartTotal = products.reduce(
    (total, product) => total + product.price.amount * (cart[product._id] ?? 0),
    0
  )

  const cartCurrency = products[0]?.price.currencyCode ?? 'USD'

  return (
    <Dialog>
      <DialogOverlay className="fixed inset-0 bg-black/50">
        <CenterContent>
          <DialogContent className="mt-24 max-h-full overflow-auto rounded-lg bg-white px-7 py-8">
            <form className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-bold uppercase tracking-[0.04em]">
                  Cart ({cartItemsCount})
                </DialogTitle>
                <button className="text-[15px] font-medium text-black/50 underline">
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
                    {formatCurrency({
                      currencyCode: cartCurrency,
                      amount: cartTotal,
                    })}
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
          </DialogContent>
        </CenterContent>
      </DialogOverlay>
    </Dialog>
  )
}
