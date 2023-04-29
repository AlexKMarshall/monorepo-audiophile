import Link from 'next/link'
import { type ReactNode } from 'react'
import '~/styles/globals.css'

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/" className="text-blue-800 underline">
            audiophile
          </Link>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/category/headphones">Headphones</Link>
              </li>
              <li>
                <Link href="/category/speakers">Speakers</Link>
              </li>
              <li>
                <Link href="/category/earphones">Earphones</Link>
              </li>
            </ul>
          </nav>
          <Link href="/cart" className="text-blue-800 underline">
            Cart
          </Link>
        </header>
        {children}
        <footer>
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
          <p>
            Audiophile is an all in one stop to fulfill your audio needs.
            We&apos;re a small team of music lovers and sound specialists who
            are devoted to helping you get the most out of personal audio. Come
            and visit our demo facility - we&apos;re open 7 days a week.
          </p>
          <div>Social links</div>
          <p>Copyright 2021. All Rights Reserved</p>
        </footer>
        {modal}
      </body>
    </html>
  )
}
