import { test, expect } from '@playwright/test'
import { getPageObjectModel } from './pageObjectModel'

test('add to cart', async ({ page, viewport }) => {
  const pageObjectModel = getPageObjectModel({ page, viewport })

  await page.goto('/product/xx99-mark-ii-headphones')
  await pageObjectModel.addToCart(2)

  await page.goto('/product/xx59-headphones')
  await pageObjectModel.addToCart(3)

  // Go to cart
  await pageObjectModel.getCartLink().click()

  await expect(page.getByRole('form').getByRole('listitem')).toHaveCount(2)

  // Go to checkout
  await page.getByRole('button', { name: /checkout/i }).click()

  await expect(
    page.getByRole('heading', { name: /checkout/i, level: 1 })
  ).toBeVisible()

  // Fill in the form
  await page.getByRole('textbox', { name: /name/i }).fill('John Doe')
  await page
    .getByRole('textbox', { name: /email address/i })
    .fill('john@example.com')
  await page.getByRole('textbox', { name: /phone number/i }).fill('1234567890')
  await page
    .getByRole('textbox', { name: /your address/i })
    .fill('123 Fake Street')
  await page.getByRole('textbox', { name: /zip code/i }).fill('12345')
  await page.getByRole('textbox', { name: /city/i }).fill('Springfield')
  await page.getByRole('textbox', { name: /country/i }).fill('United States')
  await page.getByRole('radio', { name: /e-money/i }).check()

  // Complete the order
  await page.getByRole('button', { name: /continue & pay/i }).click()

  // Order confirmation
  await expect(
    page.getByRole('heading', { name: /thank you for your order/i, level: 1 })
  ).toBeVisible()

  // Cart should be cleared
  await pageObjectModel.getCartLink().click()

  await expect(page.getByRole('heading', { name: /cart empty/i })).toBeVisible()
})
