import { test, expect, type Page, type ViewportSize } from '@playwright/test'
import { screens } from '../../../apps/shop/tailwind.config'

const getPageObjectModel = ({
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

  return {
    getPrimaryNavLink,
  }
}

test('main navigation', async ({ page, viewport }) => {
  await page.goto('/')

  const pageObjectModel = getPageObjectModel({ page, viewport })

  await expect(
    page.getByRole('heading', { name: /audiophile homepage/i, level: 1 })
  ).toBeVisible()

  await (await pageObjectModel.getPrimaryNavLink(/headphones/i)).click()

  await expect(
    page.getByRole('heading', { name: /headphones/i, level: 1 })
  ).toBeVisible()

  await (await pageObjectModel.getPrimaryNavLink(/speakers/i)).click()

  await expect(
    page.getByRole('heading', { name: /speakers/i, level: 1 })
  ).toBeVisible()

  await (await pageObjectModel.getPrimaryNavLink(/earphones/i)).click()

  await expect(
    page.getByRole('heading', { name: /earphones/i, level: 1 })
  ).toBeVisible()

  await page
    .getByRole('link', { name: /audiophile home/i })
    .first()
    .click()

  await expect(
    page.getByRole('heading', { name: /audiophile homepage/i, level: 1 })
  ).toBeVisible()
})
