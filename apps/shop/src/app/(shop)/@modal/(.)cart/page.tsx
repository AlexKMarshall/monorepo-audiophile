import { getCartFromCookies } from '~/cart'
import { fetchQuery } from '~/contentClient'
import { productZod } from '@audiophile/content-schema'
import { z } from 'zod'

export default async function CartModalPage() {
  const cart = getCartFromCookies()

  const productIds = Object.keys(cart)

  const products = await fetchQuery({
    query: `*[_type == "product" && _id in $productIds]{title, _id,}`,
    params: { productIds },
    validationSchema: z.array(productZod.pick({ title: true, _id: true })),
  })

  console.log(products)

  return <div>Cart in modal</div>
}
