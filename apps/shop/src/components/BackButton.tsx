'use client'

import { useRouter } from 'next/navigation'
import { type ButtonHTMLAttributes } from 'react'

export type BackButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
>
export function BackButton(props: BackButtonProps) {
  const router = useRouter()

  return <button {...props} onClick={() => router.back()} />
}
