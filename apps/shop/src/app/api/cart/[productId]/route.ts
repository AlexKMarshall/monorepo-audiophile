import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { cartReducer, getCartFromCookies, updateCartCookie } from '~/cart'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params
  const requestSchema = z.object({
    quantity: z.number().int().positive(),
  })
  try {
    const body = (await request.json()) as unknown
    const parsedBody = requestSchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(parsedBody.error, { status: 400 })
    }
    const { quantity } = parsedBody.data

    const cart = getCartFromCookies()

    const updatedCart = cartReducer(cart, {
      type: 'update',
      productId,
      quantity,
    })

    updateCartCookie(updatedCart)

    revalidatePath('/')
    revalidatePath('/cart')

    return NextResponse.json({ productId: 'updated' })
  } catch (error) {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
}
