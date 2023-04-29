import clsx from 'clsx'
import { Manrope } from 'next/font/google'

import Link from 'next/link'
import { type ReactNode } from 'react'
import '~/styles/globals.css'

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
        <header className="bg-black text-white">
          <Link href="/" className="text-blue-800 underline">
            audiophile
          </Link>
          <nav>
            <ul>
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
          <Link href="/cart" className="text-blue-800 underline">
            Cart
          </Link>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-950 text-white">
          <Link href="/" className="text-blue-800 underline">
            audiophile
          </Link>
          <nav>
            <ul>
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
          <p className="opacity-50">
            Audiophile is an all in one stop to fulfill your audio needs.
            We&apos;re a small team of music lovers and sound specialists who
            are devoted to helping you get the most out of personal audio. Come
            and visit our demo facility - we&apos;re open 7 days a week.
          </p>
          <p className="opacity-50">Copyright 2021. All Rights Reserved</p>
          <div>Social links</div>
        </footer>
        {modal}
      </body>
    </html>
  )
}
