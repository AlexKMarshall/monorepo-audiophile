'use client'

import { useMutation } from '@tanstack/react-query'
import { type InputHTMLAttributes } from 'react'

type QuantityInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onBlur'
>

export function QuantityInput(props: QuantityInputProps) {
  const updateCartLine = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string
      quantity: number
    }) => {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = (await response.json()) as unknown
      if (!response.ok)
        throw new Error('Failed to update cart line', { cause: data })
      return data
    },
  })

  return (
    <input
      type="number"
      onBlur={(event) => {
        const defaultValue = Number(props.defaultValue)
        const quantity = Number(event.target.value)
        if (quantity === defaultValue) return

        const productId = event.target.name

        updateCartLine.mutate({ productId, quantity })
      }}
      {...props}
    />
  )
}
