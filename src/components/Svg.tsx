import { type ReactNode } from 'react'

export function Svg({
  title,
  className,
  children,
  viewBox,
}: {
  title?: string
  className?: string
  children: ReactNode
  viewBox: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      aria-hidden={!Boolean(title)}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  )
}
