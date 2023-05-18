/* eslint-disable @typescript-eslint/require-await */
'use server'

import { revalidatePath } from 'next/cache'
import { cartReducer, getCart, getUserId, saveCart } from '~/cart'

export async function updateCartLine({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}) {
  const userId = await getUserId()
  const cart = await getCart(userId)

  const updatedCart = cartReducer(cart, {
    type: 'update',
    productId,
    quantity,
  })

  await saveCart(userId, updatedCart)

  revalidatePath('/cart')
}
