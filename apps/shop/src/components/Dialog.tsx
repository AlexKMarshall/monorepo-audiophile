'use client'
import * as RadixDialog from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export function Dialog({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <RadixDialog.Root
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    >
      <RadixDialog.Portal>{children}</RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export const DialogTitle = RadixDialog.Title
export const DialogDescription = RadixDialog.Description
export const DialogClose = RadixDialog.Close
export const DialogOverlay = RadixDialog.Overlay
export const DialogContent = RadixDialog.Content
