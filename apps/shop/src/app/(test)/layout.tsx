import { ReactNode } from 'react'
import { myServerAction } from '~/serverAction'

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <form action={myServerAction}>
          <button type="submit">Layout action</button>
        </form>
        {children}
      </body>
    </html>
  )
}
