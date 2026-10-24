import { test, expect } from '@playwright/test'
import { resetDb, searchCatalog } from './helpers'

test.describe('smoke', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('catalog renders NFTs from the mock API', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('nft-grid')).toBeVisible()
    const cards = page.getByTestId('nft-grid').getByRole('link')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('navigates to a detail page and back', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.getByTestId('nft-grid').getByRole('link').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/nft\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: 'Voltar' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('search filters the catalog', async ({ page }) => {
    await page.goto('/')
    await searchCatalog(page, 'Ape')
    await expect(page.getByTestId('nft-grid')).toBeVisible()
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
  })
})
