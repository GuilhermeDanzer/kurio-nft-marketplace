import { expect, type Page } from '@playwright/test'

/**
 * Reset the in-memory MSW database. Must be called via the page context
 * (page.evaluate fetch) so the request is routed through the MSW service
 * worker — APIRequestContext would bypass it.
 */
export async function resetDb(page: Page): Promise<void> {
  await page.goto('/').catch(() => page.reload())
  await page.evaluate(async () => {
    await fetch('/api/__reset', { method: 'POST' })
  })
  await page.evaluate(() => localStorage.removeItem('kurio:token'))
  await page.reload().catch(() => undefined)
  await page.waitForLoadState('domcontentloaded').catch(() => undefined)
}

export async function login(page: Page, email = 'ana@kurio.test', password = 'senha123'): Promise<void> {
  await page.goto('/')
  await page.getByRole('button', { name: /Entrar/ }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('E-mail', { exact: true }).fill(email)
  await dialog.getByLabel('Senha', { exact: true }).fill(password)
  await dialog.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10_000 })
}

export async function register(
  page: Page,
  name: string,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/')
  await page.getByRole('button', { name: /Entrar/ }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Criar conta', exact: true }).first().click()
  await dialog.getByLabel('Nome de usuário', { exact: true }).fill(name)
  await dialog.getByLabel('E-mail', { exact: true }).fill(email)
  await dialog.getByLabel('Senha', { exact: true }).fill(password)
  await dialog.getByLabel('Confirmar senha', { exact: true }).fill(password)
  await dialog.locator('form').getByRole('button', { name: 'Criar conta', exact: true }).click()
}

export async function searchCatalog(page: Page, term: string): Promise<void> {
  // Desktop: the search lives behind an icon button in the header.
  // Mobile: the search input is always visible. Use `:visible` so the two
  // differently-placed inputs (one hidden by CSS) never collide.
  const searchButton = page.locator('button[aria-label="Buscar NFTs"]:visible')
  if ((await searchButton.count()) > 0) {
    await searchButton.click()
  }
  await page.locator('input[aria-label="Buscar NFTs"]:visible').fill(term)
}

export async function addToCart(page: Page, nftName: string): Promise<void> {
  await page.getByRole('link', { name: new RegExp(nftName) }).first().click()
  await expect(page).toHaveURL(/\/nft\//)
  // Wait for the detail page to render before choosing the buy control.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const buyButton = page.getByRole('button', { name: 'Comprar NFT' })
  if ((await buyButton.count()) > 0) {
    // Mobile: use the always-visible sticky buy bar.
    await buyButton.click()
  } else {
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).first().click()
  }
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByText(nftName).first()).toBeVisible()
}
