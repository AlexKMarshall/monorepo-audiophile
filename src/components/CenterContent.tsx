import { type ReactNode } from 'react'

export function CenterContent({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto box-content max-w-6xl px-6 sm:px-10">
      {children}
    </div>
  )
}
