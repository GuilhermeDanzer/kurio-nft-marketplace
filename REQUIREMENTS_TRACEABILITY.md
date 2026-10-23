# Rastreabilidade de requisitos — KURIO NFT Marketplace

## 9 telas

| Tela | Rota | Componente |
| --- | --- | --- |
| Home / Catálogo | `/` | `routes/index.tsx` + `components/catalog/CatalogExplorer.tsx` |
| Detalhes do NFT | `/nft/$nftId` | `routes/nft.$nftId.tsx` |
| Carrinho | `/cart` | `routes/cart.tsx` |
| Checkout | `/checkout` | `routes/checkout.tsx` |
| Confirmação | `/order/$orderId` | `routes/order.$orderId.tsx` |
| Login (modal) | — | `components/auth/AuthDialog.tsx` + `LoginForm.tsx` |
| Cadastro (modal) | — | `components/auth/AuthDialog.tsx` + `RegisterForm.tsx` |
| Perfil | `/account` | `routes/account.tsx` + `components/layout/AccountSidebar.tsx` |
| Carteiras | `/account/wallets` | `routes/account.wallets.tsx` |

## Requisitos funcionais

| Requisito | Onde | E2E |
| --- | --- | --- |
| Catálogo URL-driven (busca/filtros/ordenação/paginação) | `CatalogExplorer` (search params → `catalogApi.list`) | `catalog.spec.ts` |
| Fronteira MSW (dev+build) | `mocks/browser.ts` + `main.tsx` | todos os specs |
| Socket.IO via `@mswjs/socket.io-binding` | `mocks/socket.ts` (`ws.link` + `toSocketIo`) | ver limitação |
| Pedidos idempotentes (`Idempotency-Key`) | `mocks/orders.ts` + handler `POST /api/orders` | `checkout.spec.ts` |
| 2 usuários | `mocks/fixtures.ts` (`ana@kurio.test`, `bruno@kurio.test`) | `auth.spec.ts` |
| Cotação autoritativa via Decimal | `mocks/quotes.ts` (`decimal.js`) | `cart.spec.ts` (cupom/desconto) |
| Favoritos otimistas com rollback | `lib/favorites.ts` | `favorite.spec.ts` |
| Sessão/expiração/purge de cache | `lib/auth.tsx` | `auth.spec.ts` |
| Realtime (nft/order updated) | `lib/realtime.ts` (dedupe `eventId`) | `realtime.spec.ts` |
| Recibo imutável / refresh recovery | `routes/order.$orderId.tsx` (poll + reconcile) | `checkout.spec.ts` |

## Playwright (12 categorias)

smoke, auth, catalog, detail, favorite, cart, checkout, realtime, account,
responsive, a11y, visual — rodando em 2 projetos (`desktop` 1440×900 e
`mobile` Pixel 7). **75 testes passando** (67 funcionais + 8 visuais).

## Visual regression

4 telas (home, detalhe, carrinho, checkout) × 2 projetos = 8 baselines em
`tests/e2e/visual.spec.ts-snapshots/`.

## Lighthouse (medianas de 3 execuções)

| Perfil | Página | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mobile | `/` | 91 | 98 | 100 | 92 | 2748ms | 0 | 28ms |
| mobile | `/nft/n01` | 82 | 100 | 100 | 92 | 3257ms | 0.155 | 39ms |
| desktop | `/` | 100 | 98 | 100 | 92 | 640ms | 0.013 | 0 |
| desktop | `/nft/n01` | 99 | 100 | 100 | 92 | 745ms | 0.046 | 0 |

Alvo 90/95/95/90: A11y ✓ (98–100), BP ✓ (100), SEO ✓ (92), Perf ✓ na home
(91/100) e no detalhe desktop (99); detalhe mobile (82) abaixo do alvo
(limitação arquitetural — ver IMPLEMENTATION_PLAN.md).
