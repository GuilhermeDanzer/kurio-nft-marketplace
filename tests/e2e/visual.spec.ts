import { test, expect, type Page } from '@playwright/test'
import { resetDb, login, addToCart } from './helpers'

async function waitForImages(page: Page): Promise<void> {
  // Scroll through the page so lazy-loaded images start loading, then return
  // to the top and wait for every image to finish decoding.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete))
  await page.evaluate(() =>
    Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => undefined))),
  )
}

test.describe('regressão visual', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('nft-grid')).toBeVisible()
    await waitForImages(page)
    await expect(page).toHaveScreenshot('home.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('detalhe do NFT', async ({ page }) => {
    await page.goto('/nft/n01')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await waitForImages(page)
    await expect(page).toHaveScreenshot('detail.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('carrinho', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await expect(page.getByText('Seu carrinho')).toBeVisible()
    await waitForImages(page)
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })

  test('checkout', async ({ page }) => {
    await login(page)
    await addToCart(page, 'Emerald Ape')
    await page.getByRole('button', { name: /Finalizar compra|Conectar e finalizar/ }).click()
    await expect(page.getByText('Finalizar compra')).toBeVisible()
    await waitForImages(page)
    await expect(page).toHaveScreenshot('checkout.png', { fullPage: true, maxDiffPixelRatio: 0.06 })
  })
})
