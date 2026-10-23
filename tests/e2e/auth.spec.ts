import { test, expect } from '@playwright/test'
import { resetDb, login, register } from './helpers'

test.describe('autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('login com credenciais válidas', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('button', { name: /Entrar/ })).toHaveCount(0)
  })

  test('login com credenciais inválidas mostra erro', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Entrar/ }).first().click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test')
    await dialog.getByLabel('Senha', { exact: true }).fill('senha-errada')
    await dialog.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible()
  })

  test('registro cria uma conta e entra', async ({ page }) => {
    await register(page, 'Teste Novo', 'teste@kurio.test', 'senha123')
    await expect(page.getByRole('button', { name: /Entrar/ })).toHaveCount(0)
  })

  test('registro com e-mail duplicado mostra erro', async ({ page }) => {
    await register(page, 'Ana', 'ana@kurio.test', 'senha123')
    await expect(page.getByText('Já existe uma conta com este e-mail.')).toBeVisible()
  })

  test('sessão é recuperada após recarregar', async ({ page }) => {
    await login(page)
    await page.reload()
    await expect(page.getByRole('button', { name: /Entrar/ })).toHaveCount(0)
  })

  test('logout retorna ao estado convidado', async ({ page, isMobile }) => {
    test.skip(isMobile, 'sidebar de conta é desktop-only')
    await login(page)
    await page.goto('/account')
    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page.getByRole('button', { name: /Entrar/ }).first()).toBeVisible()
  })
})
