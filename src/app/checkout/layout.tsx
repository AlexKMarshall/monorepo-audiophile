import { type ReactNode } from 'react'

export default function CheckoutLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <div>
      {children}
      {modal}
    </div>
  )
}
