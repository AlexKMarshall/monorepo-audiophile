/* eslint-disable @typescript-eslint/require-await */
'use server'

import { revalidatePath } from 'next/cache'
import { cartReducer, getCartFromCookies, updateCartCookie } from '~/cart'

export async function updateCartLine({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}) {
  const cart = getCartFromCookies()

  const updatedCart = cartReducer(cart, {
    type: 'update',
    productId,
    quantity,
  })

  updateCartCookie(updatedCart)

  revalidatePath('/')
}
