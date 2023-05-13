import { type Page, type ViewportSize } from '@playwright/test'
import { screens } from '../../../apps/shop/tailwind.config'

export const getPageObjectModel = ({
  page,
  viewport,
}: {
  page: Page
  viewport: ViewportSize | null
}) => {
  const getPrimaryNavLink = async (name: string | RegExp) => {
    if (!viewport) throw new Error('Viewport is missing')

    if (viewport.width >= screens.lg) {
      return page
        .getByRole('navigation', { name: /primary/i })
        .getByRole('link', { name })
    }

    await page.getByRole('button', { name: /open navigation menu/i }).click()

    return page
      .getByRole('navigation', { name: /primary/i })
      .getByRole('link', { name })
  }

  const getProductLink = (name: string | RegExp) => {
    const linkName = new RegExp(
      `see product ${name instanceof RegExp ? name.source : name}`,
      'i'
    )
    return page.getByRole('link', { name: linkName })
  }

  const getCartLink = () => page.getByRole('link', { name: /cart/i })

  const getCartLines = () =>
    page.getByRole('form', { name: /cart/i }).getByRole('listitem')

  const getCartLine = (name: string | RegExp) =>
    getCartLines().filter({ hasText: name })

  const getCartSummaryValue = (name: string | RegExp) =>
    page
      .getByTestId('cart-summary-item')
      .filter({ has: page.getByText(name) })
      .getByRole('definition')

  return {
    getPrimaryNavLink,
    getProductLink,
    getCartLink,
    getCartLines,
    getCartLine,
    getCartSummaryValue,
  }
}
