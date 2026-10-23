import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/routes'
import { NftDetailPage } from '@/routes/nft.$nftId'
import { CartPage } from '@/routes/cart'
import { CheckoutPage } from '@/routes/checkout'
import { OrderConfirmationPage } from '@/routes/order.$orderId'
import { AccountPage } from '@/routes/account'
import { WalletsPage } from '@/routes/account.wallets'

const rootRoute = createRootRoute({ component: RootLayout })

const catalogSearchSchema = z.object({
  q: z.string().optional(),
  collections: z.string().optional(),
  networks: z.string().optional(),
  status: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
})

/**
 * The catalog search params are human-readable plain strings (comma-joined
 * for multi-select). TanStack Router's default serializer JSON-quotes
 * numeric-looking strings (e.g. `page=2` → `page="2"`), so we pin plain
 * string serialization for this route.
 */
function plainParseSearch(searchStr: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!searchStr) return out
  const params = new URLSearchParams(searchStr.replace(/^\?/, ''))
  for (const [key, value] of params) out[key] = value
  return out
}

function plainStringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const s = params.toString()
  return s ? `?${s}` : ''
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  validateSearch: catalogSearchSchema,
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NftDetailPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: OrderConfirmationPage,
})

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/wallets',
  component: WalletsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  accountRoute,
  walletsRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  basepath: import.meta.env.BASE_URL,
  parseSearch: plainParseSearch,
  stringifySearch: plainStringifySearch,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
