import type { Collection, Nft, Order, Quote, User, Wallet } from '@/lib/contracts'
import { credentials, networks, seedCollections, seedNfts, users, walletsByUser } from './fixtures'
import { uid } from '@/lib/id'

export interface CartEntry {
  nftId: string
  quantity: number
}

export interface QuoteRecord extends Quote {
  cartKey: string
  couponCode: string | null
  fingerprint: string
}

export interface DbState {
  version: number
  collections: Collection[]
  nfts: Nft[]
  users: User[]
  credentials: Record<string, string>
  sessions: Record<string, string>
  carts: Record<string, CartEntry[]>
  cartCoupons: Record<string, string | null>
  favorites: Record<string, string[]>
  wallets: Record<string, Wallet[]>
  ordersByUser: Record<string, Order[]>
  ordersByKey: Record<string, { body: string; orderId: string }>
  quotes: Record<string, QuoteRecord>
  scenario: string | null
}

type Listener = (event: string, payload: unknown) => void
const listeners = new Set<Listener>()

export function onDbEvent(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitDb(event: string, payload: unknown): void {
  for (const fn of listeners) fn(event, payload)
}

const STORAGE_KEY = 'kurio:mocks:db:v4'

function emptyState(): DbState {
  return {
    version: 4,
    collections: seedCollections(),
    nfts: seedNfts(),
    users: users.map((u) => ({ ...u })),
    credentials: { ...credentials },
    sessions: {},
    carts: {},
    cartCoupons: {},
    favorites: {},
    wallets: JSON.parse(JSON.stringify(walletsByUser)) as Record<string, Wallet[]>,
    ordersByUser: {},
    ordersByKey: {},
    quotes: {},
    scenario: null,
  }
}

let state: DbState = load()

function load(): DbState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DbState
      if (parsed.version === 4) return parsed
    }
  } catch {
    /* storage unavailable — fresh state */
  }
  const fresh = emptyState()
  persist(fresh)
  return fresh
}

function persist(s: DbState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* quota exceeded — keep in-memory */
  }
}

export function save(): void {
  persist(state)
}

export function getState(): DbState {
  return state
}

export function resetDb(): void {
  state = emptyState()
  persist(state)
}

/* ── Auth ─────────────────────────────────────────────────────── */
export function resolveUserId(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice('Bearer '.length)
  return state.sessions[token] ?? null
}

export function getUser(userId: string): User | null {
  return state.users.find((u) => u.id === userId) ?? null
}

export function loginUser(email: string, password: string): { token: string; user: User } | null {
  const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return null
  if (state.credentials[user.id] !== password) return null
  const token = uid('tok')
  state.sessions[token] = user.id
  save()
  return { token, user }
}

export function registerUser(name: string, email: string, password: string): { token: string; user: User } | null {
  const exists = state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return null
  const user: User = { id: uid('u'), name, email, avatarUrl: null, bio: null }
  state.users.push(user)
  state.credentials[user.id] = password
  state.favorites[user.id] = []
  state.wallets[user.id] = []
  const token = uid('tok')
  state.sessions[token] = user.id
  save()
  return { token, user }
}

export function logout(token: string): void {
  delete state.sessions[token]
  save()
}

/* ── Catalog ──────────────────────────────────────────────────── */
export function getNft(id: string): Nft | null {
  return state.nfts.find((n) => n.id === id) ?? null
}

export function allNfts(): Nft[] {
  return state.nfts
}

export function allCollections(): Collection[] {
  return state.collections
}

export function networksList() {
  return networks
}

/* ── Cart ─────────────────────────────────────────────────────── */
export function cartKeyFor(userId: string | null, guestKey: string | null): string {
  if (userId) return `user:${userId}`
  const gk = guestKey && guestKey.length > 0 ? guestKey : 'guest:default'
  return `guest:${gk}`
}

export function getCart(userId: string | null, guestKey: string | null): CartEntry[] {
  return state.carts[cartKeyFor(userId, guestKey)] ?? []
}

export function getCoupon(userId: string | null, guestKey: string | null): string | null {
  return state.cartCoupons[cartKeyFor(userId, guestKey)] ?? null
}

export function setCoupon(userId: string | null, guestKey: string | null, code: string | null): void {
  state.cartCoupons[cartKeyFor(userId, guestKey)] = code
  save()
}

export function addToCart(userId: string | null, guestKey: string | null, nftId: string, quantity: number): void {
  const key = cartKeyFor(userId, guestKey)
  const entries = state.carts[key] ?? []
  const existing = entries.find((e) => e.nftId === nftId)
  if (existing) existing.quantity += quantity
  else entries.push({ nftId, quantity })
  state.carts[key] = entries
  save()
}

export function setQuantity(userId: string | null, guestKey: string | null, nftId: string, quantity: number): void {
  const key = cartKeyFor(userId, guestKey)
  const entries = state.carts[key] ?? []
  if (quantity <= 0) state.carts[key] = entries.filter((e) => e.nftId !== nftId)
  else {
    const existing = entries.find((e) => e.nftId === nftId)
    if (existing) existing.quantity = quantity
    else entries.push({ nftId, quantity })
  }
  save()
}

export function removeFromCart(userId: string | null, guestKey: string | null, nftId: string): void {
  const key = cartKeyFor(userId, guestKey)
  state.carts[key] = (state.carts[key] ?? []).filter((e) => e.nftId !== nftId)
  save()
}

export function clearCart(userId: string | null, guestKey: string | null): void {
  const key = cartKeyFor(userId, guestKey)
  state.carts[key] = []
  state.cartCoupons[key] = null
  save()
}

export function mergeGuestCart(userId: string, guestKey: string | null): void {
  if (!guestKey) return
  const guestCartKey = `guest:${guestKey}`
  const guestEntries = state.carts[guestCartKey]
  const guestCoupon = state.cartCoupons[guestCartKey]
  if (!guestEntries || guestEntries.length === 0) return
  const userKey = `user:${userId}`
  const userEntries = state.carts[userKey] ?? []
  for (const e of guestEntries) {
    const existing = userEntries.find((u) => u.nftId === e.nftId)
    if (existing) existing.quantity += e.quantity
    else userEntries.push({ ...e })
  }
  state.carts[userKey] = userEntries
  if (guestCoupon && !state.cartCoupons[userKey]) state.cartCoupons[userKey] = guestCoupon
  delete state.carts[guestCartKey]
  delete state.cartCoupons[guestCartKey]
  save()
}

/* ── Favorites ────────────────────────────────────────────────── */
export function getFavorites(userId: string): string[] {
  return state.favorites[userId] ?? []
}

export function addFavorite(userId: string, nftId: string): void {
  const set = new Set(state.favorites[userId] ?? [])
  set.add(nftId)
  state.favorites[userId] = [...set]
  save()
}

export function removeFavorite(userId: string, nftId: string): void {
  state.favorites[userId] = (state.favorites[userId] ?? []).filter((id) => id !== nftId)
  save()
}

/* ── Wallets ──────────────────────────────────────────────────── */
export function getWallets(userId: string): Wallet[] {
  return state.wallets[userId] ?? []
}

export function addWallet(userId: string, w: Omit<Wallet, 'id' | 'isDefault'>): Wallet {
  const list = state.wallets[userId] ?? []
  const wallet: Wallet = { ...w, id: uid('w'), isDefault: list.length === 0 }
  state.wallets[userId] = [...list, wallet]
  save()
  return wallet
}

export function removeWallet(userId: string, walletId: string): void {
  const list = state.wallets[userId] ?? []
  state.wallets[userId] = list.filter((w) => w.id !== walletId)
  save()
}

export function setDefaultWallet(userId: string, walletId: string): void {
  const list = state.wallets[userId] ?? []
  state.wallets[userId] = list.map((w) => ({ ...w, isDefault: w.id === walletId }))
  save()
}

/* ── Profile / scenario ───────────────────────────────────────── */
export function updateProfile(
  userId: string,
  patch: { name?: string; bio?: string; avatarUrl?: string | null },
): User | null {
  const user = getUser(userId)
  if (!user) return null
  if (patch.name !== undefined) user.name = patch.name
  if (patch.bio !== undefined) user.bio = patch.bio
  if (patch.avatarUrl !== undefined) user.avatarUrl = patch.avatarUrl
  save()
  return user
}

export function changePassword(userId: string, currentPassword: string, newPassword: string): boolean {
  if (state.credentials[userId] !== currentPassword) return false
  state.credentials[userId] = newPassword
  save()
  return true
}

export function setScenario(name: string | null): void {
  state.scenario = name
  save()
}



