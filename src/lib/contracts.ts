import { z } from 'zod'

/* ────────────────────────────────────────────────────────────────
   KURIO domain contracts. zod is the single source of truth; the
   MSW handlers validate against these schemas at the boundary and
   the axios client parses responses with them at runtime.
──────────────────────────────────────────────────────────────── */

export const networkIdSchema = z.enum(['ethereum', 'polygon', 'arbitrum'])
export type NetworkId = z.infer<typeof networkIdSchema>

export const networkSchema = z.object({
  id: networkIdSchema,
  name: z.string(),
  symbol: z.string(),
})
export type Network = z.infer<typeof networkSchema>

export const nftStatusSchema = z.enum(['available', 'sold'])
export type NftStatus = z.infer<typeof nftStatusSchema>

export const editionTypeSchema = z.enum(['unique', 'limited', 'open'])
export type EditionType = z.infer<typeof editionTypeSchema>

export const nftSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  name: z.string(),
  collectionId: z.string(),
  networkId: networkIdSchema,
  status: nftStatusSchema,
  edition: z.object({
    type: editionTypeSchema,
    total: z.number().int().positive().nullable(),
    number: z.number().int().positive().nullable(),
  }),
  priceEth: z.string(),
  imageUrl: z.string(),
  attributes: z.array(z.string()),
  description: z.string(),
  rating: z.number().min(0).max(5),
  ratingCount: z.number().int().nonnegative(),
  createdAt: z.string(),
})
export type Nft = z.infer<typeof nftSchema>

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  itemCount: z.number().int().nonnegative(),
  floorEth: z.string(),
})
export type Collection = z.infer<typeof collectionSchema>

export const facetOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  count: z.number().int().nonnegative(),
})
export type FacetOption = z.infer<typeof facetOptionSchema>

export const facetsSchema = z.object({
  collections: z.array(facetOptionSchema),
  networks: z.array(facetOptionSchema),
  price: z.object({ minEth: z.string(), maxEth: z.string() }),
  statuses: z.array(facetOptionSchema),
})
export type Facets = z.infer<typeof facetsSchema>

export const catalogSortSchema = z.enum([
  'recent',
  'price_asc',
  'price_desc',
  'rating',
  'name',
])
export type CatalogSort = z.infer<typeof catalogSortSchema>

export const catalogResponseSchema = z.object({
  items: z.array(nftSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  facets: facetsSchema,
})
export type CatalogResponse = z.infer<typeof catalogResponseSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>

export const sessionSchema = z.object({
  token: z.string(),
  user: userSchema,
})
export type Session = z.infer<typeof sessionSchema>

export const cartItemSchema = z.object({
  nftId: z.string(),
  quantity: z.number().int().positive(),
  nft: nftSchema,
})
export type CartItem = z.infer<typeof cartItemSchema>

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  couponCode: z.string().nullable(),
})
export type Cart = z.infer<typeof cartSchema>

export const quoteSchema = z.object({
  id: z.string(),
  subtotalEth: z.string(),
  discountEth: z.string(),
  networkFeeEth: z.string(),
  totalEth: z.string(),
  currency: z.string(),
  expiresAt: z.string(),
})
export type Quote = z.infer<typeof quoteSchema>

export const walletTypeSchema = z.enum(['metamask', 'walletconnect', 'coinbase'])
export type WalletType = z.infer<typeof walletTypeSchema>

export const walletSchema = z.object({
  id: z.string(),
  type: walletTypeSchema,
  address: z.string(),
  networkId: networkIdSchema,
  isDefault: z.boolean(),
})
export type Wallet = z.infer<typeof walletSchema>

export const orderStatusSchema = z.enum(['pending', 'confirmed', 'rejected'])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const orderItemSchema = z.object({
  nftId: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  quantity: z.number().int().positive(),
  unitPriceEth: z.string(),
})
export type OrderItem = z.infer<typeof orderItemSchema>

export const orderSchema = z.object({
  id: z.string(),
  status: orderStatusSchema,
  subtotalEth: z.string(),
  discountEth: z.string(),
  networkFeeEth: z.string(),
  totalEth: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(orderItemSchema),
  wallet: z.object({
    type: walletTypeSchema,
    address: z.string(),
    networkId: networkIdSchema,
  }),
  txHash: z.string().nullable(),
  idempotencyKey: z.string(),
  quoteId: z.string(),
})
export type Order = z.infer<typeof orderSchema>

export const favoriteSchema = z.object({ nftId: z.string() })
export type Favorite = z.infer<typeof favoriteSchema>

export const apiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'UNAUTHORIZED',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'QUOTE_STALE',
  'IDEMPOTENCY_KEY_REUSED',
  'OUT_OF_STOCK',
  'LIMIT_EXCEEDED',
  'NETWORK_ERROR',
  'INTERNAL',
])
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
})
export type ApiErrorShape = z.infer<typeof apiErrorSchema>
