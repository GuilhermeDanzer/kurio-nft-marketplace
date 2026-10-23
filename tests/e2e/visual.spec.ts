import { test, expect } from '@playwright/test'
import { resetDb, login, addToCart } from './helpers'

test.describe('regressão visual', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('nft-grid')).toBeVisible()
    await expect(page).toHaveScreenshot('home.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('detalhe do NFT', async ({ page }) => {
    await page.goto('/nft/n01')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page).toHaveScreenshot('detail.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('carrinho', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await expect(page.getByText('Seu carrinho')).toBeVisible()
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('checkout', async ({ page }) => {
    await login(page)
    await addToCart(page, 'Emerald Ape')
    await page.getByRole('button', { name: /Finalizar compra|Conectar e finalizar/ }).click()
    await expect(page.getByText('Finalizar compra')).toBeVisible()
    await expect(page).toHaveScreenshot('checkout.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })
})
