import { Svg } from './Svg'

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 8 12" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="m1.322 1 5 5-5 5"
      />
    </Svg>
  )
}
