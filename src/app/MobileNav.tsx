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
  type RefObject,
} from 'react'
import { Svg } from '~/components/Svg'

function toggleReducer(state: boolean, action: 'toggle' | 'open' | 'closed') {
  switch (action) {
    case 'toggle':
      return !state
    case 'open':
      return true
    case 'closed':
      return false
  }
}

function useToggle(initialState = false) {
  return useReducer(toggleReducer, initialState)
}

type MobileNavContext = {
  state: {
    isOpen: boolean
    toggle: (action: 'toggle' | 'open' | 'closed') => void
  }
  navRef: RefObject<HTMLDivElement>
  panelId: string
  dataState: 'open' | 'closed'
}
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

export function MobileNav({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const [isOpen, toggle] = useToggle()
  const panelId = useId()

  useEffect(() => {
    // We use the containerRef rather than the nav ref so we don't close
    // the menu if the user focuses the trigger
    const closeOnFocusOutside = () => {
      if (!containerRef.current?.contains(document.activeElement)) {
        toggle('closed')
      }
    }

    document.addEventListener('focusin', closeOnFocusOutside)
    return () => document.removeEventListener('focusin', closeOnFocusOutside)
  }, [toggle])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggle('closed')
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [toggle])

  useEffect(() => {
    const closeOnClickOutside = (event: MouseEvent) => {
      if (isOpen && !navRef.current?.contains(event.target as Node)) {
        toggle('closed')
      }
    }

    document.addEventListener('click', closeOnClickOutside)
    return () => document.removeEventListener('click', closeOnClickOutside)
  }, [toggle, isOpen])

  return (
    <MobileNavContext.Provider
      value={{
        state: { isOpen, toggle },
        navRef,
        panelId,
        dataState: isOpen ? 'open' : 'closed',
      }}
    >
      <div ref={containerRef} className={className}>
        <button
          onClick={() => toggle('toggle')}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? 'close navigation menu' : 'open navigation menu'}
        >
          <HamburgerIcon className="w-4" />
        </button>
        {children}
        {/* <div
          id={panelId}
          className={clsx(
            isOpen ? 'fixed inset-0 block bg-black/40' : 'hidden'
          )}
        >
          <nav ref={navRef} className="bg-white p-8 text-gray-950">
            {children}
          </nav>
        </div> */}
      </div>
    </MobileNavContext.Provider>
  )
}

export function MobileNavOverlay({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { dataState } = useMobileNavContext()
  return (
    <div
      // id={panelId}
      data-state={dataState}
      className={className}
      // className={clsx(
      //   state.isOpen ? 'fixed inset-0 block bg-black/40' : 'hidden'
      // )}
    >
      {children}
    </div>
  )
}

export function MobileNavContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { navRef, dataState, panelId } = useMobileNavContext()
  return (
    <nav
      id={panelId}
      ref={navRef}
      data-state={dataState}
      className={className}
      // className="bg-white p-8 text-gray-950">
    >
      {children}
    </nav>
  )
}

type MobileNavLinkProps = Omit<ComponentProps<typeof Link>, 'tabIndex'>
export function MobileNavLink(props: MobileNavLinkProps) {
  const { state } = useMobileNavContext()

  return (
    <Link
      {...props}
      tabIndex={state.isOpen ? undefined : -1}
      onClick={() => state.toggle('closed')}
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
