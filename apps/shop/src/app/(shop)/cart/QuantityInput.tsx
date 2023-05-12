'use client'

import { useTransition, type InputHTMLAttributes } from 'react'
import { updateCartLine } from './updateCartLine'

type QuantityInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onBlur'
>

export function QuantityInput(props: QuantityInputProps) {
  const [isPending, startTransition] = useTransition()

  // const updateCartLine = useMutation({
  //   mutationFn: async ({
  //     productId,
  //     quantity,
  //   }: {
  //     productId: string
  //     quantity: number
  //   }) => {
  //     const response = await fetch(`/api/cart/${productId}`, {
  //       method: 'PATCH',
  //       body: JSON.stringify({ quantity }),
  //       headers: { 'Content-Type': 'application/json' },
  //     })
  //     const data = (await response.json()) as unknown
  //     if (!response.ok)
  //       throw new Error('Failed to update cart line', { cause: data })
  //     return data
  //   },
  // })

  return (
    <input
      type="number"
      onBlur={(event) => {
        const defaultValue = Number(props.defaultValue)
        const quantity = Number(event.target.value)
        if (quantity === defaultValue) return

        const productId = event.target.name

        console.log({ productId, quantity })

        startTransition(() => updateCartLine({ productId, quantity }))
      }}
      {...props}
    />
  )
}
