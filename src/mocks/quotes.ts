import type { QuoteRecord } from './store'
import {
  cartKeyFor,
  getCart,
  getCoupon,
  getNft,
  getState,
  save,
} from './store'
import { addEth, discountEth, networkFeeEth, subEth } from '@/lib/money'
import { uid } from '@/lib/id'

export interface CouponDef {
  code: string
  rate: number
  label: string
}

export const coupons: CouponDef[] = [
  { code: 'KURIO10', rate: 0.1, label: 'Desconto do lançamento' },
  { code: 'WEB3', rate: 0.15, label: 'Desconto comunidade' },
]

export function couponFor(code: string | null): CouponDef | null {
  if (!code) return null
  return coupons.find((c) => c.code.toLowerCase() === code.toLowerCase()) ?? null
}

export function fingerprint(userId: string | null, guestKey: string | null): string {
  const entries = getCart(userId, guestKey)
  const coupon = getCoupon(userId, guestKey)
  return JSON.stringify({ entries, coupon })
}

export interface Totals {
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
}

export function computeTotals(userId: string | null, guestKey: string | null): Totals {
  const entries = getCart(userId, guestKey)
  const subtotalEth = addEth(
    ...entries.map((e) => {
      const nft = getNft(e.nftId)
      return nft ? mulForQuantity(nft.priceEth, e.quantity) : '0'
    }),
  )
  const coupon = couponFor(getCoupon(userId, guestKey))
  const discount = coupon ? discountEth(subtotalEth, coupon.rate) : '0'
  const fee = networkFeeEth(subtotalEth)
  const totalEth = subEth(addEth(subtotalEth, fee), discount)
  return { subtotalEth, discountEth: discount, networkFeeEth: fee, totalEth }
}

function mulForQuantity(priceEth: string, quantity: number): string {
  // decimal multiplication without pulling the whole money surface here
  return addEth(...Array.from({ length: quantity }, () => priceEth))
}

export function createQuote(userId: string | null, guestKey: string | null, couponCode: string | null): QuoteRecord {
  const key = cartKeyFor(userId, guestKey)
  const totals = computeTotals(userId, guestKey)
  const quote: QuoteRecord = {
    id: uid('q'),
    subtotalEth: totals.subtotalEth,
    discountEth: totals.discountEth,
    networkFeeEth: totals.networkFeeEth,
    totalEth: totals.totalEth,
    currency: 'ETH',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    cartKey: key,
    couponCode,
    fingerprint: fingerprint(userId, guestKey),
  }
  getState().quotes[quote.id] = quote
  save()
  return quote
}

export function getQuote(quoteId: string): QuoteRecord | null {
  return getState().quotes[quoteId] ?? null
}
