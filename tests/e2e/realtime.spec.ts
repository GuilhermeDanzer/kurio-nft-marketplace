import { test, expect } from '@playwright/test'
import { resetDb, login, addToCart, searchCatalog } from './helpers'

test.describe('realtime', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('compra confirma e o NFT comprado vira Vendido no catálogo', async ({ page }) => {
    await login(page)
    await addToCart(page, 'Emerald Ape')
    await page.getByRole('button', { name: /Finalizar compra|Conectar e finalizar/ }).click()
    await expect(page).toHaveURL(/\/checkout/)
    const confirm = page.getByRole('button', { name: 'Confirmar compra' })
    await expect(confirm).toBeEnabled()
    await confirm.click()
    await expect(page).toHaveURL(/\/order\//)
    await expect(page.getByText('Compra confirmada!')).toBeVisible({ timeout: 10_000 })

    // O item comprado agora está marcado como vendido no catálogo.
    await page.goto('/')
    await searchCatalog(page, 'Emerald Ape')
    await expect(page.getByRole('link', { name: /Emerald Ape/ }).getByText('Vendido')).toBeVisible()
  })
})
