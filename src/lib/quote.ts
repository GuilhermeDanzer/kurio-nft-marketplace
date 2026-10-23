import { useQuery } from '@tanstack/react-query'
import { quoteApi } from '@/lib/api/client'
import { useAuth } from './auth'
import { useCart } from './cart'

/** Authoritative pricing for the current cart, refreshed when it changes. */
export function useQuote() {
  const { token, guestKey } = useAuth()
  const { cart } = useCart()
  const coupon = cart?.couponCode ?? null
  const fingerprint = cart?.items.map((i) => `${i.nftId}:${i.quantity}`).join('|') ?? ''

  return useQuery({
    queryKey: ['quote', token, guestKey, coupon, fingerprint],
    queryFn: () => quoteApi.create(token, guestKey, coupon),
    enabled: Boolean(cart && cart.items.length > 0),
  })
}
