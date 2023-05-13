import { test, expect } from '@playwright/test'
import { getPageObjectModel } from './pageObjectModel'

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

test('product navigation', async ({ page, viewport }) => {
  await page.goto('/headphones')

  const pageObjectModel = getPageObjectModel({ page, viewport })

  await pageObjectModel.getProductLink(/xx99 mark ii/i).click()

  await expect(
    page.getByRole('heading', { name: /xx99 mark ii/i, level: 1 })
  ).toBeVisible()
})
