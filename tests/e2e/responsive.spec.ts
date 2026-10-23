import { test, expect } from '@playwright/test'
import { resetDb } from './helpers'

test.describe('responsivo (mobile)', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('barra de navegação móvel está visível', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only')
    await page.goto('/')
    await expect(page.getByLabel('Navegação móvel')).toBeVisible()
  })

  test('barra de compra fixa aparece no detalhe', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only')
    await page.goto('/nft/n01')
    await expect(page.getByRole('button', { name: 'Comprar NFT' })).toBeVisible()
  })

  test('sem overflow horizontal nas telas principais', async ({ page }) => {
    for (const path of ['/', '/nft/n01', '/cart']) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `${path} deve caber na largura`).toBeLessThanOrEqual(1)
    }
  })
})
