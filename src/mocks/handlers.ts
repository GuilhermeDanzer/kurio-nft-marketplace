import { http, HttpResponse } from 'msw'
import type { ApiErrorCode, NetworkId, Nft, WalletType } from '@/lib/contracts'
import { z } from 'zod'
import {
  addFavorite,
  addToCart,
  addWallet,
  allCollections,
  allNfts,
  changePassword,
  getCart,
  getCoupon,
  getFavorites,
  getNft,
  getUser,
  getWallets,
  loginUser,
  logout,
  mergeGuestCart,
  networksList,
  registerUser,
  removeFavorite,
  removeFromCart,
  removeWallet,
  resetDb,
  resolveUserId,
  setCoupon,
  setDefaultWallet,
  setQuantity,
  setScenario,
  updateProfile,
} from './store'
import { computeTotals, couponFor, createQuote } from './quotes'
import { createOrder, getOrder, listOrders, reconcilePendingOrders } from './orders'
import { categories } from './fixtures'

function ok(data: unknown, status = 200) {
  return HttpResponse.json(data as Parameters<typeof HttpResponse.json>[0], { status })
}

function err(code: ApiErrorCode, message: string, status: number, details?: Record<string, unknown>) {
  return HttpResponse.json({ code, message, ...(details ? { details } : {}) }, { status })
}

function authUserId(request: Request): string | null {
  return resolveUserId(request.headers.get('Authorization'))
}

function guestKey(request: Request): string | null {
  return request.headers.get('X-Guest-Key')
}

function getList(sp: URLSearchParams, key: string): string[] {
  return [...new Set([...sp.getAll(key), ...sp.getAll(`${key}[]`)])]
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })

function maxQuantity(nft: Nft): number {
  return nft.edition.type === 'unique' ? 1 : 5
}

function buildCart(userId: string | null, gk: string | null) {
  return {
    items: getCart(userId, gk)
      .map((e) => {
        const nft = getNft(e.nftId)
        return nft ? { nftId: e.nftId, quantity: e.quantity, nft } : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
    couponCode: getCoupon(userId, gk),
  }
}

export const handlers = [
  /* ── Auth ───────────────────────────────────────────────────── */
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json().catch(() => null)
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return err('VALIDATION_ERROR', 'Dados inválidos.', 400)
    const result = registerUser(parsed.data.name, parsed.data.email, parsed.data.password)
    if (!result) return err('CONFLICT', 'Já existe uma conta com este e-mail.', 409)
    return ok({ token: result.token, user: result.user }, 201)
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json().catch(() => null)
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) return err('VALIDATION_ERROR', 'Dados inválidos.', 400)
    const result = loginUser(parsed.data.email, parsed.data.password)
    if (!result) return err('UNAUTHORIZED', 'E-mail ou senha incorretos.', 401)
    mergeGuestCart(result.user.id, guestKey(request))
    return ok({ token: result.token, user: result.user })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    const user = getUser(userId)
    if (!user) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    const token = request.headers.get('Authorization')!.slice('Bearer '.length)
    return ok({ token, user })
  }),

  http.post('/api/auth/logout', ({ request }) => {
    const header = request.headers.get('Authorization')
    if (header?.startsWith('Bearer ')) logout(header.slice('Bearer '.length))
    return new HttpResponse(null, { status: 204 })
  }),

  /* ── Catalog ────────────────────────────────────────────────── */
  http.get('/api/catalog', ({ request }) => {
    const sp = new URL(request.url).searchParams
    const q = (sp.get('q') ?? '').toLowerCase().trim()
    const collections = getList(sp, 'categories')
    const networks = getList(sp, 'networks')
    const priceMin = sp.get('priceMin')
    const priceMax = sp.get('priceMax')
    const sort = sp.get('sort') ?? 'recent'
    const page = Math.max(1, Number(sp.get('page') ?? 1))
    const pageSize = Math.min(50, Math.max(1, Number(sp.get('pageSize') ?? 12)))

    let items = allNfts()

    if (q) {
      items = items.filter((n) => {
        const col = allCollections().find((c) => c.id === n.collectionId)
        const haystack = `${n.name} ${n.tokenId} ${n.attributes.join(' ')} ${col?.name ?? ''}`.toLowerCase()
        return haystack.includes(q)
      })
    }
    if (collections.length) items = items.filter((n) => collections.includes(n.categoryId))
    if (networks.length) items = items.filter((n) => networks.includes(n.networkId))
    if (priceMin) items = items.filter((n) => Number(n.priceEth) >= Number(priceMin))
    if (priceMax) items = items.filter((n) => Number(n.priceEth) <= Number(priceMax))

    const sorted = [...items]
    switch (sort) {
      case 'price_asc':
        sorted.sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
        break
      case 'price_desc':
        sorted.sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }

    const total = sorted.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const paged = sorted.slice(start, start + pageSize)

    const all = allNfts()
    const facets = {
      categories: categories.map((c) => ({
        id: c.id,
        label: c.name,
        count: all.filter((n) => n.categoryId === c.id).length,
      })),
      networks: networksList().map((nw) => ({
        id: nw.id,
        label: nw.name,
        count: all.filter((n) => n.networkId === nw.id).length,
      })),
      price: {
        minEth: all.length ? String(Math.min(...all.map((n) => Number(n.priceEth)))) : '0',
        maxEth: all.length ? String(Math.max(...all.map((n) => Number(n.priceEth)))) : '0',
      },
    }

    return ok({ items: paged, total, page, pageSize, totalPages, facets })
  }),

  http.get('/api/catalog/:id', ({ params }) => {
    const nft = getNft(String(params.id))
    if (!nft) return err('NOT_FOUND', 'NFT não encontrado.', 404)
    return ok(nft)
  }),

  http.get('/api/collections', () => ok(allCollections())),
  http.get('/api/networks', () => ok(networksList())),

  /* ── Favorites ──────────────────────────────────────────────── */
  http.get('/api/favorites', ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Entre para ver favoritos.', 401)
    return ok(getFavorites(userId))
  }),

  http.put('/api/favorites/:id', ({ request, params }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Entre para favoritar.', 401)
    if (!getNft(String(params.id))) return err('NOT_FOUND', 'NFT não encontrado.', 404)
    addFavorite(userId, String(params.id))
    return ok(getFavorites(userId))
  }),

  http.delete('/api/favorites/:id', ({ request, params }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Entre para favoritar.', 401)
    removeFavorite(userId, String(params.id))
    return ok(getFavorites(userId))
  }),

  /* ── Cart ───────────────────────────────────────────────────── */
  http.get('/api/cart', ({ request }) => {
    return ok(buildCart(authUserId(request), guestKey(request)))
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const userId = authUserId(request)
    const gk = guestKey(request)
    const body = (await request.json().catch(() => null)) as { nftId?: string; quantity?: number } | null
    const nftId = body?.nftId
    const quantity = body?.quantity ?? 1
    const nft = nftId ? getNft(nftId) : null
    if (!nft) return err('NOT_FOUND', 'NFT não encontrado.', 404)
    if (nft.status !== 'available') return err('OUT_OF_STOCK', 'Este NFT não está mais disponível.', 409)
    const current = getCart(userId, gk).find((e) => e.nftId === nftId)?.quantity ?? 0
    if (current + quantity > maxQuantity(nft)) return err('LIMIT_EXCEEDED', 'Limite de unidades excedido.', 409)
    addToCart(userId, gk, nft.id, quantity)
    return ok(buildCart(userId, gk))
  }),

  http.patch('/api/cart/items/:nftId', async ({ request, params }) => {
    const userId = authUserId(request)
    const gk = guestKey(request)
    const nftId = String(params.nftId)
    const body = (await request.json().catch(() => null)) as { quantity?: number } | null
    const quantity = body?.quantity ?? 0
    const nft = getNft(nftId)
    if (!nft) return err('NOT_FOUND', 'NFT não encontrado.', 404)
    if (quantity > maxQuantity(nft)) return err('LIMIT_EXCEEDED', 'Limite de unidades excedido.', 409)
    setQuantity(userId, gk, nftId, quantity)
    return ok(buildCart(userId, gk))
  }),

  http.delete('/api/cart/items/:nftId', ({ request, params }) => {
    removeFromCart(authUserId(request), guestKey(request), String(params.nftId))
    return ok(buildCart(authUserId(request), guestKey(request)))
  }),

  http.post('/api/cart/coupon', async ({ request }) => {
    const userId = authUserId(request)
    const gk = guestKey(request)
    const body = (await request.json().catch(() => null)) as { code?: string } | null
    const code = body?.code?.trim() ?? ''
    if (code === '') {
      setCoupon(userId, gk, null)
      return ok(buildCart(userId, gk))
    }
    if (!couponFor(code)) return err('BAD_REQUEST', 'Código promocional inválido.', 400)
    setCoupon(userId, gk, code)
    return ok(buildCart(userId, gk))
  }),

  /* ── Quotes ─────────────────────────────────────────────────── */
  http.post('/api/quotes', async ({ request }) => {
    const userId = authUserId(request)
    const gk = guestKey(request)
    if (getCart(userId, gk).length === 0) return err('BAD_REQUEST', 'Seu carrinho está vazio.', 400)
    const body = (await request.json().catch(() => null)) as { couponCode?: string | null } | null
    const quote = createQuote(userId, gk, body?.couponCode ?? null)
    return ok(quote, 201)
  }),

  /* ── Orders ─────────────────────────────────────────────────── */
  http.post('/api/orders', async ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Entre para finalizar a compra.', 401)
    const body = (await request.json().catch(() => null)) as {
      idempotencyKey?: string
      quoteId?: string
      walletType?: string
    } | null
    const idempotencyKey = request.headers.get('Idempotency-Key') ?? body?.idempotencyKey
    const quoteId = body?.quoteId
    const walletType = body?.walletType
    if (!idempotencyKey || !quoteId || !walletType) return err('VALIDATION_ERROR', 'Dados incompletos.', 400)
    if (!['metamask', 'walletconnect', 'coinbase'].includes(walletType)) {
      return err('VALIDATION_ERROR', 'Carteira inválida.', 400)
    }
    const result = createOrder(userId, { idempotencyKey, quoteId, walletType: walletType as WalletType })
    if (!result.ok) {
      if (result.reason === 'STALE') {
        return err('QUOTE_STALE', 'A cotação mudou. Confirme os novos valores.', 409, {
          currentTotalEth: computeTotals(userId, null).totalEth,
        })
      }
      if (result.reason === 'EMPTY') return err('BAD_REQUEST', 'Seu carrinho está vazio.', 400)
      return err('UNAUTHORIZED', 'Entre para finalizar a compra.', 401)
    }
    return ok(result.order, result.reused ? 200 : 201)
  }),

  http.get('/api/orders', ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    reconcilePendingOrders()
    return ok(listOrders(userId))
  }),

  http.get('/api/orders/:id', ({ request, params }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    reconcilePendingOrders()
    const order = getOrder(userId, String(params.id))
    if (!order) return err('NOT_FOUND', 'Pedido não encontrado.', 404)
    return ok(order)
  }),

  /* ── Profile ────────────────────────────────────────────────── */
  http.patch('/api/profile', async ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    const body = (await request.json().catch(() => null)) as {
      name?: string
      bio?: string
      avatarUrl?: string | null
    } | null
    const user = updateProfile(userId, body ?? {})
    if (!user) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    return ok(user)
  }),

  http.patch('/api/profile/password', async ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    const body = (await request.json().catch(() => null)) as {
      currentPassword?: string
      newPassword?: string
    } | null
    if (!body?.currentPassword || !body?.newPassword) return err('VALIDATION_ERROR', 'Dados incompletos.', 400)
    if (!changePassword(userId, body.currentPassword, body.newPassword)) {
      return err('BAD_REQUEST', 'Senha atual incorreta.', 400)
    }
    return new HttpResponse(null, { status: 204 })
  }),

  /* ── Wallets ────────────────────────────────────────────────── */
  http.get('/api/wallets', ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    return ok(getWallets(userId))
  }),

  http.post('/api/wallets', async ({ request }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    const body = (await request.json().catch(() => null)) as {
      type?: string
      address?: string
      networkId?: string
    } | null
    if (!body?.type || !body?.address || !body?.networkId) return err('VALIDATION_ERROR', 'Dados incompletos.', 400)
    if (!['metamask', 'walletconnect', 'coinbase'].includes(body.type)) {
      return err('VALIDATION_ERROR', 'Carteira inválida.', 400)
    }
    if (!['ethereum', 'polygon', 'solana'].includes(body.networkId)) {
      return err('VALIDATION_ERROR', 'Rede inválida.', 400)
    }
    const wallet = addWallet(userId, {
      type: body.type as WalletType,
      address: body.address,
      networkId: body.networkId as NetworkId,
    })
    return ok(wallet, 201)
  }),

  http.delete('/api/wallets/:id', ({ request, params }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    removeWallet(userId, String(params.id))
    return ok(getWallets(userId))
  }),

  http.patch('/api/wallets/:id/default', ({ request, params }) => {
    const userId = authUserId(request)
    if (!userId) return err('UNAUTHORIZED', 'Sessão expirada.', 401)
    setDefaultWallet(userId, String(params.id))
    return ok(getWallets(userId))
  }),

  /* ── Scenario / reset (test control) ────────────────────────── */
  http.post('/api/scenario', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as { name?: string | null } | null
    setScenario(body?.name ?? null)
    return ok({ scenario: body?.name ?? null })
  }),

  http.post('/api/__reset', () => {
    resetDb()
    return new HttpResponse(null, { status: 204 })
  }),
]



