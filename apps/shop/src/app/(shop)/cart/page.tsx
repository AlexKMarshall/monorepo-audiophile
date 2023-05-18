import { cartReducer, getCart, getUserId } from '~/cart'
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
import { saveCart } from '~/cart'

export default async function CartPage() {
  const userId = await getUserId()
  const cart = await getCart(userId)

  const productIds = cart.items.map((item) => item.productId)

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
    (total, product) =>
      total +
      product.price.amount *
        (cart.items.find(({ productId }) => productId === product._id)
          ?.quantity ?? 0),
    0
  )

  const cartCurrency = products[0]?.price.currencyCode ?? 'USD'

  // eslint-disable-next-line @typescript-eslint/require-await
  async function checkout(data: FormData) {
    'use server'

    const cart = await getCart(userId)

    const cartUpdateDataPipeline = z.instanceof(FormData).transform((data) =>
      [...data.entries()]
        .filter(([key]) => key.startsWith('items'))
        .map(([key, value]) => {
          const [, productId, field] = key.split('.')
          return [productId, field, value]
        })
        .map(([productId, field, value]) =>
          z
            .tuple([
              z.string(),
              z.literal('quantity'),
              z.coerce.number().min(0),
            ])
            .parse([productId, field, value])
        )
        .map(([productId, field, value]) => ({ productId, [field]: value }))
    )

    const cartReplaceData = cartUpdateDataPipeline.parse(data)

    const updatedCart = cartReducer(cart, {
      type: 'replace',
      items: cartReplaceData,
    })

    await saveCart(userId, updatedCart)

    revalidatePath('/')
    revalidatePath('/cart')
    return redirect('/checkout')
  }

  async function removeAll() {
    'use server'
    const userId = await getUserId()
    const cart = await getCart(userId)

    const updatedCart = cartReducer(cart, {
      type: 'removeAll',
    })

    await saveCart(userId, updatedCart)

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
            {cart.items.map((cartItem) => {
              const product = products.find(
                (product) => product._id === cartItem.productId
              )
              if (!product) return null
              return (
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
                    defaultValue={cartItem.quantity}
                    name={`items.${cartItem.productId}.quantity`}
                    aria-label="Quantity"
                  />
                </li>
              )
            })}
          </ul>
          <div className="flex flex-col gap-6">
            <dl>
              <div
                className="flex items-center justify-between"
                data-testid="cart-summary-item"
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
