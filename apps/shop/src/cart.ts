import { cookies } from 'next/headers'

import { z } from 'zod'

export const cartSchema = z.record(z.number().min(1))

type Cart = z.infer<typeof cartSchema>
type CartAction =
  | { type: 'add'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'update'; productId: string; quantity: number }

export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add':
      return {
        ...cart,
        [action.productId]: (cart[action.productId] ?? 0) + action.quantity,
      }
    case 'remove':
      const { [action.productId]: _, ...rest } = cart
      return rest
    case 'update':
      return {
        ...cart,
        [action.productId]: action.quantity,
      }
  }
}

const cartCookieName = 'audiophile-cart'

export function getCartFromCookies() {
  const cartCookie = cookies().get(cartCookieName)?.value
  const rawCart: unknown = cartCookie ? JSON.parse(cartCookie) : {}

  return cartSchema.parse(rawCart)
}

export function updateCartCookie(cart: Cart) {
  // @ts-expect-error - nextjs types are wrong
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cookies().set(cartCookieName, JSON.stringify(cart))
}
