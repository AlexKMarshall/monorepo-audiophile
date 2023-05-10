import { test, expect } from '@playwright/test'

test('add to cart', async ({ page, viewport }) => {
  await page.goto('/product/xx99-mark-ii-headphones')

  await expect(
    page.getByRole('heading', { name: /xx99 mark ii headphones/i, level: 1 })
  ).toBeVisible()

  await expect(page.getByRole('link', { name: /cart empty/i })).toBeVisible()

  await page.getByRole('spinbutton', { name: /quantity/i }).fill('2')

  await page.getByRole('button', { name: /add to cart/i }).click()

  // Cart badge only shows line items, not total quantity
  await expect(
    page.getByRole('link', { name: /cart with 1 items/i })
  ).toBeVisible()

  await page.goto('/product/xx59-headphones')

  await expect(
    page.getByRole('heading', { name: /xx59 headphones/i, level: 1 })
  ).toBeVisible()

  await page.getByRole('spinbutton', { name: /quantity/i }).fill('3')

  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(
    page.getByRole('link', { name: /cart with 2 items/i })
  ).toBeVisible()
})
