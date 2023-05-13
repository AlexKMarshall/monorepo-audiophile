'use client'

import { useTransition, type InputHTMLAttributes } from 'react'
import { updateCartLine } from './updateCartLine'

type QuantityInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onBlur'
>

export function QuantityInput(props: QuantityInputProps) {
  const [, startTransition] = useTransition()

  return (
    <input
      type="number"
      onBlur={(event) => {
        const defaultValue = Number(props.defaultValue)
        const quantity = Number(event.target.value)
        if (quantity === defaultValue) return

        const productId = event.target.name

        startTransition(() => updateCartLine({ productId, quantity }))
      }}
      {...props}
    />
  )
}
