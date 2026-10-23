import { test, expect } from '@playwright/test'
import { resetDb, login } from './helpers'

test.describe('favoritos', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('convidado abre login ao favoritar', async ({ page }) => {
    await page.goto('/nft/n01')
    const fav = page.getByRole('button', { name: 'Adicionar aos favoritos' })
    await fav.scrollIntoViewIfNeeded()
    await fav.click({ force: true })
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('usuário logado alterna favorito', async ({ page }) => {
    await login(page)
    await page.goto('/nft/n01')
    const fav = page.getByRole('button', { name: 'Adicionar aos favoritos' })
    await fav.scrollIntoViewIfNeeded()
    await fav.click({ force: true })
    await expect(page.getByRole('button', { name: 'Remover dos favoritos' })).toBeVisible()
  })
})
