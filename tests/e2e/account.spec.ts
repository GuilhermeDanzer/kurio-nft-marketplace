import { test, expect } from '@playwright/test'
import { resetDb, login } from './helpers'

test.describe('conta', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('edita o perfil', async ({ page }) => {
    await login(page)
    await page.goto('/account')
    await page.getByLabel('Nome').fill('Ana Editada')
    await page.getByRole('button', { name: 'Salvar alterações' }).click()
    await expect(page.getByText('Perfil atualizado.')).toBeVisible()
  })

  test('altera a senha', async ({ page }) => {
    await login(page)
    await page.goto('/account')
    await page.getByLabel('Senha atual').fill('senha123')
    await page.getByLabel('Nova senha').fill('nova123')
    await page.getByRole('button', { name: 'Alterar senha' }).click()
    await expect(page.getByText('Senha alterada.')).toBeVisible()
  })

  test('adiciona uma carteira', async ({ page, isMobile }) => {
    test.skip(isMobile, 'sidebar de conta é desktop-only')
    await login(page)
    await page.goto('/account/wallets')
    await page.getByLabel('Endereço').fill('0x1111111111111111111111111111111111111111')
    await page.getByRole('button', { name: 'Adicionar' }).click()
    await expect(page.getByText('Carteira adicionada.')).toBeVisible()
  })
})
