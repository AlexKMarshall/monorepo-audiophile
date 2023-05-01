'use client'

import clsx from 'clsx'
import Link from 'next/link'
import {
  type ReactNode,
  useReducer,
  useId,
  type ComponentProps,
  createContext,
  useContext,
  useRef,
  useEffect,
} from 'react'
import { Svg } from '~/components/Svg'

function toggleReducer(state: boolean, action: 'toggle' | 'open' | 'close') {
  switch (action) {
    case 'toggle':
      return !state
    case 'open':
      return true
    case 'close':
      return false
  }
}

function useToggle(initialState = false) {
  return useReducer(toggleReducer, initialState)
}

type MobileNavContext = ReturnType<typeof useToggle>
const MobileNavContext = createContext<MobileNavContext | null>(null)

function useMobileNavContext() {
  const context = useContext(MobileNavContext)
  if (context === null) {
    throw new Error(
      'MobileNav component components must be used within MobileNav'
    )
  }
  return context
}

export function MobileNav({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const [isOpen, toggle] = useToggle()
  const panelId = useId()

  useEffect(() => {
    // We use the containerRef rather than the nav ref so we don't close
    // the menu if the user focuses the trigger
    const closeOnFocusOutside = () => {
      if (!containerRef.current?.contains(document.activeElement)) {
        toggle('close')
      }
    }

    document.addEventListener('focusin', closeOnFocusOutside)
    return () => document.removeEventListener('focusin', closeOnFocusOutside)
  }, [toggle])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggle('close')
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [toggle])

  useEffect(() => {
    const closeOnClickOutside = (event: MouseEvent) => {
      if (isOpen && !navRef.current?.contains(event.target as Node)) {
        toggle('close')
      }
    }

    document.addEventListener('click', closeOnClickOutside)
    return () => document.removeEventListener('click', closeOnClickOutside)
  }, [toggle, isOpen])

  return (
    <MobileNavContext.Provider value={[isOpen, toggle]}>
      <div ref={containerRef}>
        <button
          onClick={() => toggle('toggle')}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? 'close navigation menu' : 'open navigation menu'}
        >
          <HamburgerIcon className="w-4" />
        </button>
        <div id={panelId} className={clsx(isOpen ? 'block' : 'hidden')}>
          <nav ref={navRef}>{children}</nav>
        </div>
      </div>
    </MobileNavContext.Provider>
  )
}

type MobileNavLinkProps = Omit<ComponentProps<typeof Link>, 'tabIndex'>
export function MobileNavLink(props: MobileNavLinkProps) {
  const [isOpen, toggle] = useMobileNavContext()

  return (
    <Link
      {...props}
      tabIndex={isOpen ? undefined : -1}
      onClick={() => toggle('close')}
    />
  )
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 16 15" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 0h16v3H0zm0 6h16v3H0zm0 6h16v3H0z"
      />
    </Svg>
  )
}
