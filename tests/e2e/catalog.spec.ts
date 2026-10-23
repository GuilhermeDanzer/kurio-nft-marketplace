import { test, expect } from '@playwright/test'
import { resetDb } from './helpers'

test.describe('catálogo', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb(page)
  })

  test('filtra por coleção e reflete na URL', async ({ page, isMobile }) => {
    test.skip(isMobile, 'sidebar de filtros é desktop-only')
    await page.goto('/')
    await page.getByRole('checkbox', { name: 'Kurio Apes' }).check()
    await expect(page).toHaveURL(/collections=c1/)
    const cards = page.getByTestId('nft-grid').getByRole('link')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('ordena por menor preço', async ({ page, isMobile }) => {
    test.skip(isMobile, 'select de ordenação é desktop-only')
    await page.goto('/')
    await page.getByLabel('Ordenar').click()
    await page.getByRole('option', { name: 'Menor preço' }).click()
    await expect(page).toHaveURL(/sort=price_asc/)
  })

  test('paginação avança para a página 2', async ({ page, isMobile }) => {
    test.skip(isMobile, 'paginação é desktop-only')
    await page.goto('/')
    await page.getByRole('button', { name: 'Próxima' }).click()
    await expect(page).toHaveURL(/page=2/)
  })

  test('busca sem resultado mostra estado vazio', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Buscar NFTs').fill('xyz-nao-existe')
    await expect(page.getByText('Nenhum NFT encontrado.')).toBeVisible()
  })
})
