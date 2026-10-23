import type { Order, Wallet } from '@/lib/contracts'
import {
  clearCart,
  emitDb,
  getCart,
  getNft,
  getState,
  getUser,
  getWallets,
  save,
} from './store'
import { computeTotals, fingerprint, getQuote } from './quotes'
import { uid } from '@/lib/id'

export function findOrderByIdempotencyKey(key: string): Order | null {
  const rec = getState().ordersByKey[key]
  if (!rec) return null
  for (const orders of Object.values(getState().ordersByUser)) {
    const found = orders.find((o) => o.id === rec.orderId)
    if (found) return found
  }
  return null
}

export type CreateOrderResult =
  | { ok: true; order: Order; reused: boolean }
  | { ok: false; reason: 'STALE' | 'EMPTY' | 'UNAUTHORIZED' }

export function createOrder(
  userId: string,
  input: { idempotencyKey: string; quoteId: string; walletType: Wallet['type'] },
): CreateOrderResult {
  const state = getState()
  const user = getUser(userId)
  if (!user) return { ok: false, reason: 'UNAUTHORIZED' }

  const idemRec = state.ordersByKey[input.idempotencyKey]
  if (idemRec) {
    const bodyHash = JSON.stringify(input)
    if (idemRec.body === bodyHash) {
      const existing = state.ordersByUser[userId]?.find((o) => o.id === idemRec.orderId)
      if (existing) return { ok: true, order: existing, reused: true }
    }
    return { ok: false, reason: 'STALE' }
  }

  const entries = getCart(userId, null)
  if (entries.length === 0) return { ok: false, reason: 'EMPTY' }

  const quote = getQuote(input.quoteId)
  const currentFingerprint = fingerprint(userId, null)
  const stale =
    !quote ||
    quote.cartKey !== `user:${userId}` ||
    quote.fingerprint !== currentFingerprint ||
    new Date(quote.expiresAt).getTime() < Date.now()
  if (stale) return { ok: false, reason: 'STALE' }

  const wallets = getWallets(userId)
  const wallet = wallets.find((w) => w.type === input.walletType) ?? wallets[0]
  const totals = computeTotals(userId, null)

  const now = new Date().toISOString()
  const order: Order = {
    id: uid('ord'),
    status: 'pending',
    subtotalEth: totals.subtotalEth,
    discountEth: totals.discountEth,
    networkFeeEth: totals.networkFeeEth,
    totalEth: totals.totalEth,
    createdAt: now,
    updatedAt: now,
    items: entries.map((e) => {
      const nft = getNft(e.nftId)!
      return { nftId: e.nftId, name: nft.name, imageUrl: nft.imageUrl, quantity: e.quantity, unitPriceEth: nft.priceEth }
    }),
    wallet: wallet
      ? { type: wallet.type, address: wallet.address, networkId: wallet.networkId }
      : { type: 'metamask', address: '0x0000000000000000000000000000000000000000', networkId: 'ethereum' },
    txHash: null,
    idempotencyKey: input.idempotencyKey,
    quoteId: input.quoteId,
  }

  state.ordersByKey[input.idempotencyKey] = { body: JSON.stringify(input), orderId: order.id }
  state.ordersByUser[userId] = [...(state.ordersByUser[userId] ?? []), order]
  clearCart(userId, null)
  save()

  window.setTimeout(() => confirmOrder(order.id), 1200)

  return { ok: true, order, reused: false }
}

export function confirmOrder(orderId: string): Order | null {
  const state = getState()
  for (const orders of Object.values(state.ordersByUser)) {
    const order = orders.find((o) => o.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'confirmed'
      order.updatedAt = new Date().toISOString()
      order.txHash = `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`
      for (const item of order.items) {
        const nft = getNft(item.nftId)
        if (nft && nft.status === 'available') nft.status = 'sold'
      }
      save()
      emitDb('order.updated', {
        eventId: uid('evt'),
        version: Date.now(),
        orderId: order.id,
        status: order.status,
        totalEth: order.totalEth,
      })
      for (const item of order.items) {
        emitDb('nft.updated', { eventId: uid('evt'), version: Date.now(), nftId: item.nftId, status: 'sold' })
      }
      return order
    }
  }
  return null
}

export function reconcilePendingOrders(thresholdMs = 2000): void {
  const now = Date.now()
  for (const orders of Object.values(getState().ordersByUser)) {
    for (const order of orders) {
      if (order.status === 'pending' && now - new Date(order.createdAt).getTime() > thresholdMs) {
        confirmOrder(order.id)
      }
    }
  }
}

export function getOrder(userId: string, orderId: string): Order | null {
  return getState().ordersByUser[userId]?.find((o) => o.id === orderId) ?? null
}

export function listOrders(userId: string): Order[] {
  return [...(getState().ordersByUser[userId] ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
