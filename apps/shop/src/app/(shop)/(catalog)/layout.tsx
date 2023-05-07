import Image from 'next/image'
import { type ReactNode } from 'react'
import bestGearMobile from './image-best-gear-mobile.jpg'
import bestGearTablet from './image-best-gear-tablet.jpg'
import bestGearDesktop from './image-best-gear-desktop.jpg'
import { CenterContent } from '~/components/CenterContent'

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <CenterContent>
        <div className="mb-32 flex flex-col items-center gap-10 sm:gap-16 lg:mb-40 lg:flex-row-reverse lg:gap-32">
          <div className="overflow-hidden rounded-lg lg:basis-1/2">
            <Image
              src={bestGearDesktop}
              alt="man listening with over-ear headphones against a patterned wall"
              className="hidden lg:block"
            />
            <Image
              src={bestGearTablet}
              alt="man listening with over-ear headphones against a patterned wall"
              className="hidden sm:block lg:hidden"
            />
            <Image
              src={bestGearMobile}
              alt="man listening with over-ear headphones against a patterned wall"
              className="sm:hidden"
            />
          </div>
          <div className="max-w-xl text-center lg:basis-1/2 lg:text-left">
            <h2 className="mb-8 text-3xl font-bold uppercase leading-none tracking-wide sm:text-5xl">
              Bringing you the <span className="text-orange-500">best</span>{' '}
              audio gear
            </h2>
            <p className="font-medium leading-6 text-black/50">
              Located at the heart of New York City, Audiophile is the premier
              store for high end headphones, earphones, speakers, and audio
              accessories. We have a large showroom and luxury demonstration
              rooms available for you to browse and experience a wide range of
              our products. Stop by our store to meet some of the fantastic
              people who make Audiophile the best place to buy your portable
              audio equipment.
            </p>
          </div>
        </div>
      </CenterContent>
    </div>
  )
}
