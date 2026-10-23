import { test, expect } from '@playwright/test'
import { resetDb } from './helpers'

test.describe('acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('imagens do catálogo têm texto alternativo', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('nft-grid')).toBeVisible()
    const missing = await page
      .getByTestId('nft-grid')
      .locator('img')
      .evaluateAll((imgs) => imgs.filter((i) => !i.getAttribute('alt')).length)
    expect(missing).toBe(0)
  })

  test('página tem um único heading principal', async ({ page }) => {
    await page.goto('/')
    const h1 = await page.locator('h1').count()
    expect(h1).toBe(1)
  })

  test('main landmark está presente', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()
  })

  test('botões primários têm nome acessível', async ({ page }) => {
    await page.goto('/nft/n01')
    const btns = page.locator('button')
    const count = await btns.count()
    for (let i = 0; i < count; i++) {
      const name = await btns.nth(i).getAttribute('aria-label')
      const text = await btns.nth(i).textContent()
      expect(name || (text ?? '').trim().length > 0, `botão ${i}`).toBeTruthy()
    }
  })
})
