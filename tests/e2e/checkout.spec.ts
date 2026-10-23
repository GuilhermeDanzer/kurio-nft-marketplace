import { test, expect } from '@playwright/test'
import { resetDb, login, addToCart } from './helpers'

test.describe('checkout', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('fluxo completo de compra até a confirmação', async ({ page }) => {
    await login(page)
    await addToCart(page, 'Emerald Ape')
    await page.getByRole('button', { name: /Finalizar compra|Conectar e finalizar/ }).click()
    await expect(page).toHaveURL(/\/checkout/)

    // Revisar e confirmar
    await expect(page.getByText('Finalizar compra')).toBeVisible()
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await expect(page).toHaveURL(/\/order\//)

    // Pendente → confirmado
    await expect(page.getByText(/Processando transação|Compra confirmada/)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Compra confirmada!')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Detalhes da transação')).toBeVisible()
  })

  test('checkout exige autenticação', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByText('Você precisa entrar para finalizar.')).toBeVisible()
  })

  test('carrinho vazio não permite checkout', async ({ page }) => {
    await login(page)
    await page.goto('/cart')
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })
})
