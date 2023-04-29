import { type ReactNode } from 'react'

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <p>Catalog stuff</p>
    </div>
  )
}
