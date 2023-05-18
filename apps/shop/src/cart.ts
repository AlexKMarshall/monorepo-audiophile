import { kv } from '@vercel/kv'
import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'

import { z } from 'zod'

export const cartSchema = z.object({
  id: z.string(),
  currency: z.literal('USD'),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
})

export type Cart = z.infer<typeof cartSchema>

export function getNewCart(): Cart {
  return {
    id: randomUUID(),
    currency: 'USD',
    items: [],
  }
}

type CartAction =
  | { type: 'add'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'update'; productId: string; quantity: number }
  | { type: 'replace'; items: Cart['items'] }
  | { type: 'removeAll' }

export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add':
      const existingItem = cart.items.find(
        (item) => item.productId === action.productId
      )

      if (existingItem) {
        return cartReducer(cart, {
          type: 'update',
          productId: action.productId,
          quantity: existingItem.quantity + action.quantity,
        })
      }

      return {
        ...cart,
        items: [
          ...cart.items,
          { productId: action.productId, quantity: action.quantity },
        ],
      }

    case 'remove':
      return {
        ...cart,
        items: cart.items.filter((item) => item.productId !== action.productId),
      }

    case 'update':
      if (action.quantity === 0) {
        return cartReducer(cart, {
          type: 'remove',
          productId: action.productId,
        })
      }
      return {
        ...cart,
        items: cart.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    case 'replace':
      return { ...cart, items: action.items }
    case 'removeAll':
      return {
        ...cart,
        items: [],
      }
  }
}

function getNewUserId() {
  return randomUUID()
}

const userIdCookieName = 'audiophile-user-id'

/**
 *
 * @returns An existing userId if it exists and is valid, otherwise a new one
 */
export async function getUserId() {
  // User may not have a userId cookie
  // As we're only dealing with anonymous users we can just generate a new one
  const userId = cookies().get(userIdCookieName)?.value
  if (!userId) return getNewUserId()

  // That user may not have a session yet. If they don't we can just generate a new one
  // A user could put someone else's userId in their cookies,
  // but we don't have login functionality and we're not storing sensitive data
  // In a real app we'd have the checkout process behind a login
  const sessionExists = (await kv.exists(userId)) === 1
  if (!sessionExists) return getNewUserId()

  return userId
}

/**
 * Sets the userId cookie. Can only be called inside a server action
 */
export function saveUserId(userId: string) {
  // @ts-expect-error - nextjs types are wrong
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cookies().set(userIdCookieName, userId)
}

/**
 * @returns The user's cart if it exists, otherwise a new empty cart
 */
export async function getCart(userId: string) {
  const cart = await kv.hget(userId, 'cart')
  if (!cart) {
    return getNewCart()
  }

  return cartSchema.parse(cart)
}

export function saveCart(userId: string, cart: Cart) {
  return kv.hset(userId, { cart })
}

export function removeCart(userId: string) {
  return kv.hdel(userId, 'cart')
}

const orderSchema = z.object({
  id: z.string(),
  currency: z.literal('USD'),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
})

export type Order = z.infer<typeof orderSchema>

/**
 * @returns The user's order if it exists, otherwise null
 */
export async function getOrder({
  userId,
  orderId,
}: {
  userId: string
  orderId: string
}) {
  const order = await kv.hget(userId, orderId)
  if (!order) {
    return null
  }

  return orderSchema.parse(order)
}

/**
 * Saves the order to the user's session
 */
export async function saveOrder({
  userId,
  order,
}: {
  userId: string
  order: Order
}) {
  return kv.hset(userId, { [order.id]: order })
}
