# Plano de implementação — KURIO NFT Marketplace

Executado de S1 a S12, sequencialmente. Estado final: **concluído**.

| Etapa | Escopo | Evidência |
| --- | --- | --- |
| S1 | Scaffold manual (Vite 7 + React 19 + TS 5.9 strict) + Tailwind 4 `@theme` + Roboto Mono self-host + primitivos UI (button/input/label/dialog/sheet/select/checkbox/radio/tabs/badge/skeleton/avatar/sonner) + shells (Header/Footer/MobileTabBar/AccountSidebar/RootLayout) | `npm run typecheck && npm run build` ✓ |
| S2 | Contratos zod, cliente axios + `ApiError`, `mocks/` (db persistente, 2 usuários, 24 NFTs, 9 coleções, 3 redes), handlers (auth/catalog/favorites/cart/quote/orders/profile/wallets/scenario/`__reset`), bootstrap MSW em `main.tsx` | ✓ |
| S3 | Home/catálogo URL-driven: busca/filtros/ordenação/paginação + facets da API, skeletons, empty/error/retry | E2E `catalog.spec.ts` ✓ |
| S4 | Detalhe: galeria, chips de edição, limites de quantidade, favorito otimista, add-to-cart, 404/indisponível, sticky buy bar mobile | E2E `detail.spec.ts` ✓ |
| S5 | Carrinho + pricing: CRUD, disponibilidade, cupons, `/api/quotes` via Decimal, merge guest→user | E2E `cart.spec.ts` ✓ |
| S6 | Auth + conta: modais, redirect intent, recuperação de sessão, purge de cache, perfil/senha, wallets CRUD | E2E `auth.spec.ts`, `account.spec.ts` ✓ |
| S7 | Checkout (review → revalidate → submit → pending → confirmed) + pedidos idempotentes + recibo imutável | E2E `checkout.spec.ts`, `realtime.spec.ts` ✓ |
| S8 | Socket.IO: spike do binding, `nft.updated`/`order.updated` com dedupe `eventId`+`version`, reconciliação REST | `mocks/socket.ts`, `lib/realtime.ts` ✓ (ver limitação) |
| S9 | A11y: foco/aria/live regions/contraste/reduced-motion, auditoria de overflow 390/768/1440 | E2E `a11y.spec.ts`, `responsive.spec.ts` ✓ |
| S10 | Playwright: 12 categorias × desktop 1440 + mobile 390, estado isolado via `page.evaluate(fetch('/api/__reset'))`, 8 baselines visuais | **75 passed** |
| S11 | Lighthouse: 3 runs × 2 páginas × 2 perfis em `vite preview`, medianas + LCP/CLS/TBT | `reports/lighthouse/summary.*` |
| S12 | Docs + deploy GitHub Pages (workflow + `404.html` SPA fallback) | `gh` repo + Pages |

## Comandos

```bash
npm run typecheck   # tsc (strict: noUncheckedIndexedAccess, exactOptionalPropertyTypes)
npm run lint        # eslint 9 flat (0 errors)
npm run build       # tsc -b && vite build
npm run test:e2e    # playwright test (75 testes, desktop+mobile)
npm run lighthouse  # node scripts/lighthouse.mjs
```

## Decisões

- **Deploy**: GitHub Pages (project site `GuilhermeDanzer/kurio-nft-marketplace`), `BASE_PATH='/kurio-nft-marketplace/'` + router `basepath` + `404.html` copiado de `index.html` para deep links no refresh.
- **MSW em produção**: o "backend" é mock; o deploy é 100% estático e funcional.
- **Imagens**: arte SVG data-URI determinística (offline-safe, sem rede) → Lighthouse reproduzível.
- **Realtime**: event bus in-page como fonte autoritativa (dedupe `eventId`); Socket.IO implementado via binding (ver limitação em ARCHITECTURE.md).

## Limitações conhecidas

1. `WebSocketInterceptor` do MSW 2.15 não patcheou `globalThis.WebSocket` de forma confiável no navegador; o transporte Socket.IO não conecta de fato (realtime via event bus in-page).
2. Lighthouse mobile na página de detalhe (82) fica abaixo do alvo 90 devido ao cold-start do service worker do MSW + parse do bundle em CPU throttled (arquitetural).
3. Metadados de 2 telas Figma (Cadastro desktop/mobile) foram cobertos por render + espelhamento do Login (cota de metadata esgotada).
