import { test, expect } from '@playwright/test'
import { resetDb } from './helpers'

test.describe('detalhe do NFT', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('renderiza nome e preço', async ({ page }) => {
    await page.goto('/nft/n01')
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()
    await expect(page.getByText('1.19 ETH').first()).toBeVisible()
  })

  test('mostra 404 para NFT inexistente', async ({ page }) => {
    await page.goto('/nft/nao-existe')
    await expect(page.getByText('NFT não encontrado.')).toBeVisible()
  })

  test('galeria alterna entre imagens', async ({ page }) => {
    await page.goto('/nft/n01')
    await expect(page.getByText('1/3')).toBeVisible()
    await page.getByRole('button', { name: 'Ver imagem 2' }).click()
    await expect(page.getByText('2/3')).toBeVisible()
  })
})
