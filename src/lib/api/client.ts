import type {
  Cart,
  CatalogResponse,
  CatalogSort,
  Collection,
  Nft,
  Order,
  Quote,
  Session,
  User,
  Wallet,
  WalletType,
  NetworkId,
} from '@/lib/contracts'
import { bearer, http } from './http'

/* ── Auth ─────────────────────────────────────────────────────── */
export const authApi = {
  async register(input: { name: string; email: string; password: string }): Promise<Session> {
    const { data } = await http.post('/auth/register', input)
    return data
  },
  async login(input: { email: string; password: string }): Promise<Session> {
    const { data } = await http.post('/auth/login', input)
    return data
  },
  async me(token: string | null): Promise<Session> {
    const { data } = await http.get('/auth/me', { headers: bearer(token) })
    return data
  },
  async logout(token: string): Promise<void> {
    await http.post('/auth/logout', undefined, { headers: bearer(token) })
  },
}

/* ── Catalog ──────────────────────────────────────────────────── */
export interface CatalogQuery {
  q: string | undefined
  collections: string[] | undefined
  networks: NetworkId[] | undefined
  status: string[] | undefined
  priceMin: string | undefined
  priceMax: string | undefined
  sort: CatalogSort | undefined
  page: number | undefined
  pageSize: number | undefined
}

export const catalogApi = {
  async list(query: CatalogQuery): Promise<CatalogResponse> {
    const { data } = await http.get('/catalog', { params: { ...query } })
    return data
  },
  async byId(id: string): Promise<Nft> {
    const { data } = await http.get(`/catalog/${id}`)
    return data
  },
  async collections(): Promise<Collection[]> {
    const { data } = await http.get('/collections')
    return data
  },
}

/* ── Favorites ────────────────────────────────────────────────── */
export const favoritesApi = {
  async list(token: string): Promise<string[]> {
    const { data } = await http.get('/favorites', { headers: bearer(token) })
    return data
  },
  async add(token: string, nftId: string): Promise<string[]> {
    const { data } = await http.put(`/favorites/${nftId}`, undefined, { headers: bearer(token) })
    return data
  },
  async remove(token: string, nftId: string): Promise<string[]> {
    const { data } = await http.delete(`/favorites/${nftId}`, { headers: bearer(token) })
    return data
  },
}

/* ── Cart ─────────────────────────────────────────────────────── */
export const cartApi = {
  async get(token: string | null, guestKey: string): Promise<Cart> {
    const { data } = await http.get('/cart', { headers: { ...bearer(token), 'X-Guest-Key': guestKey } })
    return data
  },
  async add(token: string | null, guestKey: string, nftId: string, quantity = 1): Promise<Cart> {
    const { data } = await http.post(
      '/cart/items',
      { nftId, quantity },
      { headers: { ...bearer(token), 'X-Guest-Key': guestKey } },
    )
    return data
  },
  async setQuantity(token: string | null, guestKey: string, nftId: string, quantity: number): Promise<Cart> {
    const { data } = await http.patch(
      `/cart/items/${nftId}`,
      { quantity },
      { headers: { ...bearer(token), 'X-Guest-Key': guestKey } },
    )
    return data
  },
  async remove(token: string | null, guestKey: string, nftId: string): Promise<Cart> {
    const { data } = await http.delete(`/cart/items/${nftId}`, {
      headers: { ...bearer(token), 'X-Guest-Key': guestKey },
    })
    return data
  },
  async applyCoupon(token: string | null, guestKey: string, code: string): Promise<Cart> {
    const { data } = await http.post(
      '/cart/coupon',
      { code },
      { headers: { ...bearer(token), 'X-Guest-Key': guestKey } },
    )
    return data
  },
}

/* ── Quotes ───────────────────────────────────────────────────── */
export const quoteApi = {
  async create(token: string | null, guestKey: string, couponCode: string | null): Promise<Quote> {
    const { data } = await http.post(
      '/quotes',
      { couponCode },
      { headers: { ...bearer(token), 'X-Guest-Key': guestKey } },
    )
    return data
  },
}

/* ── Orders ───────────────────────────────────────────────────── */
export const ordersApi = {
  async create(
    token: string,
    input: { idempotencyKey: string; quoteId: string; walletType: WalletType },
  ): Promise<Order> {
    const { data } = await http.post(
      '/orders',
      input,
      { headers: { ...bearer(token), 'Idempotency-Key': input.idempotencyKey } },
    )
    return data
  },
  async byId(token: string, id: string): Promise<Order> {
    const { data } = await http.get(`/orders/${id}`, { headers: bearer(token) })
    return data
  },
  async list(token: string): Promise<Order[]> {
    const { data } = await http.get('/orders', { headers: bearer(token) })
    return data
  },
}

/* ── Profile ──────────────────────────────────────────────────── */
export const profileApi = {
  async update(
    token: string,
    input: { name?: string; bio?: string; avatarUrl?: string | null },
  ): Promise<User> {
    const { data } = await http.patch('/profile', input, { headers: bearer(token) })
    return data
  },
  async changePassword(token: string, input: { currentPassword: string; newPassword: string }): Promise<void> {
    await http.patch('/profile/password', input, { headers: bearer(token) })
  },
}

/* ── Wallets ──────────────────────────────────────────────────── */
export const walletsApi = {
  async list(token: string): Promise<Wallet[]> {
    const { data } = await http.get('/wallets', { headers: bearer(token) })
    return data
  },
  async add(token: string, input: { type: WalletType; address: string; networkId: NetworkId }): Promise<Wallet> {
    const { data } = await http.post('/wallets', input, { headers: bearer(token) })
    return data
  },
  async remove(token: string, id: string): Promise<Wallet[]> {
    const { data } = await http.delete(`/wallets/${id}`, { headers: bearer(token) })
    return data
  },
  async setDefault(token: string, id: string): Promise<Wallet[]> {
    const { data } = await http.patch(`/wallets/${id}/default`, undefined, { headers: bearer(token) })
    return data
  },
}

/* ── Test scenario control ────────────────────────────────────── */
export const scenarioApi = {
  async set(name: string | null): Promise<void> {
    await http.post('/scenario', { name })
  },
  async reset(): Promise<void> {
    await http.post('/__reset')
  },
}

