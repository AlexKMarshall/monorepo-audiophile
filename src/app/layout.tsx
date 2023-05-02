import clsx from 'clsx'
import { Manrope } from 'next/font/google'
import Image from 'next/image'

import Link from 'next/link'
import { type ReactNode } from 'react'
import { Svg } from '~/components/Svg'
import '~/styles/globals.css'
import {
  MobileNav,
  MobileNavContent,
  MobileNavLink,
  MobileNavOverlay,
} from './MobileNav'

import headphonesThumbnail from '../../public/images/image-category-thumbnail-headphones.png'
import speakersThumbnail from '../../public/images/image-category-thumbnail-speakers.png'
import earphonesThumbnail from '../../public/images/image-category-thumbnail-earphones.png'

const manrope = Manrope({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <html lang="en">
      <body className={clsx('flex min-h-screen flex-col', manrope.className)}>
        <header className="isolate z-10 border-b border-white/10 bg-black text-white">
          <CenterContent>
            <header className="flex items-center justify-between gap-10 px-6 py-8 lg:grid lg:grid-cols-3">
              <MobileNav className="lg:hidden">
                <MobileNavOverlay className="fixed bottom-0 left-0 right-0 top-24 bg-black/40 data-[state=open]:block data-[state=closed]:hidden">
                  <MobileNavContent className="max-h-full overflow-auto rounded-b-lg bg-white px-6 pb-10 pt-7 text-black data-[state=open]:block data-[state=closed]:hidden sm:px-10 sm:pb-16 sm:pt-14">
                    <ul className="flex flex-col sm:flex-row sm:gap-3">
                      <li className="relative isolate flex flex-1 flex-col items-center p-5 before:absolute before:inset-0 before:top-1/4 before:-z-10 before:rounded-lg before:bg-gray-100">
                        <Image
                          src={headphonesThumbnail}
                          alt=""
                          className="max-h-[8rem] max-w-[8rem]"
                        />
                        <p
                          id="headphones-link-description"
                          className="mb-4 font-bold uppercase tracking-wider"
                        >
                          Headphones
                        </p>
                        <MobileNavLink
                          href="/headphones"
                          id="headphones-link"
                          aria-labelledby="headphones-link headphones-link-description"
                          className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black/50 before:absolute before:inset-0 before:cursor-pointer"
                        >
                          Shop
                          <ChevronRightIcon className="w-2 text-orange-500" />
                        </MobileNavLink>
                      </li>
                      <li className="relative isolate flex flex-1 flex-col items-center p-5 before:absolute before:inset-0 before:top-1/4 before:-z-10 before:rounded-lg before:bg-gray-100">
                        <Image
                          src={speakersThumbnail}
                          alt=""
                          className="max-h-[8rem] max-w-[8rem]"
                        />
                        <p className="mb-4 font-bold uppercase tracking-wider">
                          Speakers
                        </p>
                        <MobileNavLink
                          href="/speakers"
                          className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black/50 before:absolute before:inset-0 before:cursor-pointer"
                        >
                          Shop
                          <ChevronRightIcon className="w-2 text-orange-500" />
                        </MobileNavLink>
                      </li>
                      <li className="relative isolate flex flex-1 flex-col items-center p-5 before:absolute before:inset-0 before:top-1/4 before:-z-10 before:rounded-lg before:bg-gray-100">
                        <Image
                          src={earphonesThumbnail}
                          alt=""
                          className="max-h-[8rem] max-w-[8rem]"
                        />
                        <p className="mb-4 font-bold uppercase tracking-wider">
                          Earphones
                        </p>
                        <MobileNavLink
                          href="/earphones"
                          className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black/50 before:absolute before:inset-0 before:cursor-pointer"
                        >
                          Shop
                          <ChevronRightIcon className="w-2 text-orange-500" />
                        </MobileNavLink>
                      </li>
                    </ul>
                  </MobileNavContent>
                </MobileNavOverlay>
              </MobileNav>
              <Link
                href="/"
                aria-label="Audiophile home"
                className="sm:mr-auto lg:mr-0"
              >
                <AudiophileLogo className="w-36" />
              </Link>
              <nav className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/headphones">Headphones</Link>
                  </li>
                  <li>
                    <Link href="/speakers">Speakers</Link>
                  </li>
                  <li>
                    <Link href="/earphones">Earphones</Link>
                  </li>
                </ul>
              </nav>
              <Link href="/cart" className="justify-self-end">
                <CartIcon title="cart" className="w-6" />
              </Link>
            </header>
          </CenterContent>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-950 text-white">
          <CenterContent>
            <div className="grid justify-items-center gap-12 px-6 pb-10 text-center [grid-template-areas:'colorbar'_'logo'_'nav'_'copy'_'copyright'_'socials'] before:h-1 before:w-24 before:bg-orange-500 sm:grid-cols-[1fr_auto] sm:justify-items-start sm:gap-8 sm:px-10 sm:pb-12 sm:text-left sm:[grid-template-areas:'colorbar_colorbar'_'logo_logo'_'nav_nav'_'copy_copy'_'copyright_socials'] sm:before:mb-6 lg:gap-x-36 lg:gap-y-9 lg:[grid-template-areas:'colorbar_colorbar'_'logo_nav'_'copy_socials'_'copyright_copyright'] lg:before:mb-9">
              <Link
                href="/"
                aria-label="Audiophile home"
                className="[grid-area:logo]"
              >
                <AudiophileLogo className="w-36" />
              </Link>
              <nav className="[grid-area:nav]">
                <ul className="flex flex-col items-center gap-4 text-sm font-bold uppercase tracking-widest sm:flex-row sm:items-baseline">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/headphones">Headphones</Link>
                  </li>
                  <li>
                    <Link href="/speakers">Speakers</Link>
                  </li>
                  <li>
                    <Link href="/earphones">Earphones</Link>
                  </li>
                </ul>
              </nav>
              <p className="font-medium leading-relaxed opacity-50 [grid-area:copy] sm:mb-12 lg:mb-0">
                Audiophile is an all in one stop to fulfill your audio needs.
                We&apos;re a small team of music lovers and sound specialists
                who are devoted to helping you get the most out of personal
                audio. Come and visit our demo facility - we&apos;re open 7 days
                a week.
              </p>
              <p className="font-bold opacity-50 [grid-area:copyright] lg:mt-5">
                Copyright 2021. All Rights Reserved
              </p>
              <ul className="flex items-center gap-4 [grid-area:socials] lg:self-end lg:justify-self-end">
                <li>
                  <Link href="/">
                    <FacebookIcon className="w-6" />
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <TwitterIcon className="w-6" />
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <InstagramIcon className="w-6" />
                  </Link>
                </li>
              </ul>
            </div>
          </CenterContent>
        </footer>
        {modal}
      </body>
    </html>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
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

function CartIcon({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <Svg viewBox="0 0 23 20" className={className} title={title}>
      <path
        fill="currentColor"
        d="M8.625 15.833c1.132 0 2.054.935 2.054 2.084 0 1.148-.922 2.083-2.054 2.083-1.132 0-2.054-.935-2.054-2.083 0-1.15.922-2.084 2.054-2.084zm9.857 0c1.132 0 2.054.935 2.054 2.084 0 1.148-.922 2.083-2.054 2.083-1.132 0-2.053-.935-2.053-2.083 0-1.15.92-2.084 2.053-2.084zm-9.857 1.39a.69.69 0 0 0-.685.694.69.69 0 0 0 .685.694.69.69 0 0 0 .685-.694.69.69 0 0 0-.685-.695zm9.857 0a.69.69 0 0 0-.684.694.69.69 0 0 0 .684.694.69.69 0 0 0 .685-.694.69.69 0 0 0-.685-.695zM4.717 0a.67.67 0 0 1 .658.517l.481 2.122h16.47a.68.68 0 0 1 .538.262c.127.166.168.38.11.579l-2.695 9.236a.672.672 0 0 1-.648.478H7.41a.667.667 0 0 0-.673.66c0 .364.303.66.674.66H19.63c.372 0 .674.295.674.66 0 .364-.302.66-.674.66H7.412c-1.115 0-2.021-.889-2.021-1.98 0-.812.502-1.511 1.218-1.816L4.176 1.32H.674A.667.667 0 0 1 0 .66C0 .296.302 0 .674 0zm16.716 3.958H6.156l1.797 7.917h11.17l2.31-7.917z"
      />
    </Svg>
  )
}

function AudiophileLogo({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 143 25" className={className} title="Audiophile logo">
      <path
        fill="currentColor"
        d="M7.363 20.385c1.63 0 3.087-.537 4.237-1.47l.414.994h3.739V5.853h-3.605l-.495 1.087c-1.16-.958-2.637-1.51-4.29-1.51C3.069 5.43 0 8.527 0 12.88c0 4.37 3.07 7.505 7.363 7.505zm.646-4.287c-1.811 0-3.143-1.37-3.143-3.206 0-1.824 1.32-3.195 3.143-3.195 1.812 0 3.144 1.37 3.144 3.195 0 1.836-1.332 3.206-3.144 3.206zm17.535 4.287c4.148 0 6.91-2.562 6.91-6.495V5.868h-4.836v7.811c0 1.47-.782 2.357-2.074 2.357-1.292 0-2.09-.873-2.09-2.357V5.868h-4.836v8.022c0 3.933 2.778 6.495 6.926 6.495zm16.328.015c1.636 0 3.093-.557 4.235-1.52l.456 1.044h3.58V.792H45.36v5.591a6.551 6.551 0 0 0-3.489-.976c-4.309 0-7.378 3.12-7.378 7.489 0 4.368 3.07 7.504 7.378 7.504zm.647-4.287c-1.812 0-3.143-1.381-3.143-3.217 0-1.835 1.331-3.216 3.143-3.216 1.812 0 3.143 1.38 3.143 3.216 0 1.836-1.331 3.217-3.143 3.217zM57.976 4.109V0h-4.763v4.109h4.763zm.037 15.815V5.868h-4.837v14.056h4.837zm10.097.46c4.563 0 7.872-3.146 7.872-7.488 0-4.357-3.31-7.489-7.872-7.489-4.579 0-7.873 3.132-7.873 7.489 0 4.342 3.294 7.489 7.873 7.489zm0-4.348c-1.764 0-3.029-1.281-3.029-3.14 0-1.858 1.265-3.139 3.029-3.139 1.763 0 3.028 1.292 3.028 3.14 0 1.858-1.265 3.139-3.028 3.139zM82.998 25v-5.534a6.56 6.56 0 0 0 3.423.934c4.293 0 7.362-3.125 7.362-7.504 0-4.38-3.069-7.489-7.362-7.489-1.669 0-3.155.578-4.31 1.578l-.605-1.117h-3.29V25h4.782zm2.776-8.887c-1.812 0-3.143-1.37-3.143-3.217s1.331-3.217 3.143-3.217c1.811 0 3.143 1.37 3.143 3.217 0 1.846-1.343 3.217-3.143 3.217zm15.065 3.811v-7.506c0-1.804.912-2.843 2.376-2.843 1.262 0 1.83.826 1.83 2.447v7.902h4.837V11.46c0-3.644-2.071-6.008-5.295-6.008-1.4 0-2.714.507-3.748 1.34v-6h-4.837v19.132h4.837zM117.574 4.11V0h-4.763v4.109h4.763zm.037 15.815V5.868h-4.837v14.056h4.837zm7.878 0V.792h-4.836v19.132h4.836zm9.851.461c3.523 0 6.364-2.004 7.352-5.212h-4.813c-.465.823-1.409 1.318-2.539 1.318-1.527 0-2.55-.834-2.866-2.446H142.9c.063-.435.1-.858.1-1.282 0-4.123-3.134-7.356-7.66-7.356-4.407 0-7.626 3.17-7.626 7.478 0 4.295 3.245 7.5 7.626 7.5zm2.896-9.021h-5.677c.391-1.396 1.372-2.163 2.781-2.163 1.46 0 2.471.758 2.896 2.163z"
      />
    </Svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <Svg title="Facebook" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"
      />
    </Svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <Svg title="Twitter" viewBox="0 0 24 20" className={className}>
      <path
        fill="currentColor"
        d="M24 2.557a9.83 9.83 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337.608a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616.248c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 0 1 1.671 1.149a4.93 4.93 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.419A9.9 9.9 0 0 1 0 17.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0 0 24 2.557z"
      />
    </Svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 24 24" title="Instagram" className={className}>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </Svg>
  )
}

function CenterContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl">{children}</div>
}
