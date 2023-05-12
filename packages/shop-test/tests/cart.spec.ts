import { test, expect } from '@playwright/test'
import { getPageObjectModel } from './pageObjectModel'

test('add to cart', async ({ page, viewport }) => {
  await page.goto('/product/xx99-mark-ii-headphones')

  const pageObjectModel = getPageObjectModel({ page, viewport })

  await expect(
    page.getByRole('heading', { name: /xx99 mark ii headphones/i, level: 1 })
  ).toBeVisible()

  await expect(pageObjectModel.getCartLink()).toHaveText(/cart empty/i)

  await page.getByRole('spinbutton', { name: /quantity/i }).fill('2')

  await page.getByRole('button', { name: /add to cart/i }).click()

  // Cart badge only shows line items, not total quantity
  await expect(pageObjectModel.getCartLink()).toHaveText(/cart with 1 item/i)

  await page.goto('/product/xx59-headphones')

  await expect(
    page.getByRole('heading', { name: /xx59 headphones/i, level: 1 })
  ).toBeVisible()

  await page.getByRole('spinbutton', { name: /quantity/i }).fill('3')

  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(pageObjectModel.getCartLink()).toHaveText(/cart with 2 items/i)

  // Go to cart
  await pageObjectModel.getCartLink().click()

  await expect(
    page.getByRole('heading', { name: /cart \(2\)/i, level: 1 })
  ).toBeVisible()

  await expect(page.getByRole('form').getByRole('listitem')).toHaveCount(2)

  await expect(
    pageObjectModel
      .getCartLine(/xx99/i)
      .getByRole('spinbutton', { name: /quantity/i })
  ).toHaveValue('2')

  await expect(
    pageObjectModel
      .getCartLine(/xx59/i)
      .getByRole('spinbutton', { name: /quantity/i })
  ).toHaveValue('3')

  // Total is calculated correctly

  await expect(pageObjectModel.getCartSummaryValue(/total/i)).toHaveText(
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }).format(2 * 2999 + 3 * 897)
  )

  // Update a cart line quantity

  await pageObjectModel
    .getCartLine(/xx99/i)
    .getByRole('spinbutton', { name: /quantity/i })
    .fill('1')

  await page.keyboard.press('Tab')

  await expect(pageObjectModel.getCartSummaryValue(/total/i)).toHaveText(
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }).format(1 * 2999 + 3 * 897)
  )

  // Remove a cart line

  await pageObjectModel.getCartLine(/xx99/i).getByRole('spinbutton').fill('0')

  await page.keyboard.press('Tab')

  await expect(pageObjectModel.getCartLine(/xx99/i)).toBeHidden()

  await expect(pageObjectModel.getCartSummaryValue(/total/i)).toHaveText(
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }).format(3 * 897)
  )

  // Remove all lines

  await page.getByRole('button', { name: /remove all/i }).click()

  await expect(
    page.getByRole('heading', { name: /cart empty/i, level: 1 })
  ).toBeVisible()
})
