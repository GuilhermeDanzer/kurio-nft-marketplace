import { test, expect } from '@playwright/test'
import { resetDb, addToCart } from './helpers'

test.describe('carrinho', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('adiciona item ao carrinho', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
    await expect(page.getByText('Seu carrinho')).toBeVisible()
  })

  test('altera a quantidade', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await expect(page.getByText('Seu carrinho')).toBeVisible()
    await page.getByRole('button', { name: 'Aumentar' }).click()
    await expect(page.getByRole('group', { name: 'Quantidade' }).getByText('2', { exact: true })).toBeVisible()
  })

  test('remove item do carrinho', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await page.getByRole('button', { name: /Remover Emerald Ape/ }).click()
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })

  test('aplica cupom e mostra desconto', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await page.getByLabel('Código promocional').fill('KURIO10')
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.getByText('Cupom ativo: KURIO10')).toBeVisible()
    await expect(page.getByText('Desconto')).toBeVisible()
  })

  test('cupom inválido mostra erro', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, 'Emerald Ape')
    await page.getByLabel('Código promocional').fill('INVALIDO')
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.getByText('Código promocional inválido.')).toBeVisible()
  })
})
