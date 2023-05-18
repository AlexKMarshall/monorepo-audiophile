import Link from 'next/link'

export default function ConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div>
      <h1>Thank you for your order</h1>
      <p>You will receive an email confirmation shortly.</p>
      <Link
        href="/"
        className="inline-block bg-orange-500 px-6 py-4 text-[13px] font-bold uppercase tracking-[0.07em] text-white"
      >
        Back to home
      </Link>
    </div>
  )
}
