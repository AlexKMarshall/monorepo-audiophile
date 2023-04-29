import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <div>
      This is the checkout page
      <Link href="/confirmation/123">Confirm checkout</Link>
    </div>
  )
}
