# Arquitetura — KURIO NFT Marketplace

## Visão geral

SPA React/TypeScript cujo "backend" é inteiramente mockado **no navegador** via
Mock Service Worker (MSW). Não há servidor real: os handlers de API e o banco
em memória rodam no contexto da página, o que torna o deploy (GitHub Pages)
100% estático e funcional.

## Stack

- **UI**: React 19, TanStack Router (code-based), TanStack Query, Tailwind CSS 4 (`@theme`), shadcn-style primitives (Radix), `sonner`, `lucide-react`.
- **Dados**: `axios` (normalização de erro), `zod` (contratos como fonte de verdade), `decimal.js` (toda matemática monetária), `@fontsource/roboto-mono` (self-host).
- **Mock**: `msw` (REST + WebSocket) + `@mswjs/socket.io-binding` (Socket.IO).
- **Qualidade**: Playwright (E2E + visual), Lighthouse.

## Camadas

```
src/
  lib/contracts.ts     # zod schemas + tipos inferidos (fonte de verdade)
  lib/api/http.ts      # instância axios + ApiError normalizado
  lib/api/client.ts    # endpoints tipados (auth/catalog/cart/quote/orders/…)
  lib/money.ts         # decimal.js: add/sub/mul/networkFee/discount
  lib/auth.tsx         # AuthProvider (token/localStorage, recuperação de sessão)
  lib/cart.ts          # useCart (TanStack Query + mutations com toast)
  lib/quote.ts         # useQuote (cotação autoritativa do carrinho atual)
  lib/wallets.ts       # hooks de carteiras
  lib/realtime.ts      # reconciliação realtime (event bus do db)
  lib/socket.ts        # cliente Socket.IO (lazy; ver limitação)
  lib/collections.ts, favorites.ts, id.ts, query.ts, utils.ts
  mocks/
    art.ts             # arte SVG data-URI determinística (offline-safe)
    fixtures.ts        # 2 usuários, 24 NFTs, 9 coleções, 3 redes
    store.ts           # banco em memória + persistência localStorage + event bus
    quotes.ts          # totais (Decimal) + cotação + fingerprint
    orders.ts          # pedido idempotente + confirmação + emissão de eventos
    handlers.ts        # handlers HTTP do MSW
    socket.ts          # mock Socket.IO (ws.link + toSocketIo)
    browser.ts         # setupWorker(...) + enableMocking()
  router.tsx           # árvore de rotas + serialização de search params
  routes/              # páginas (index, nft.$nftId, cart, checkout, order.$orderId, account, account.wallets)
  components/          # ui/ (primitivos), layout/, catalog/, auth/
```

## Contratos (zod) e fronteira de dados

`lib/contracts.ts` define os schemas `nft`, `collection`, `cart`, `quote`,
`order`, `wallet`, `session`, etc. Os handlers MSW validam entradas e o cliente
axios tipa as respostas. O endpoint de cotação (`POST /api/quotes`) é a fonte
**autoritativa** de preço no checkout (subtotal, desconto, taxa de rede, total)
— toda a matemática usa `decimal.js` e os valores cruzam a fronteira como
strings decimais (nunca `number`).

## MSW (fronteira mock)

- `enableMocking()` roda em dev **e** build (necessário para o deploy ser funcional).
- O service worker é servido em `${BASE_URL}mockServiceWorker.js`.
- Estado persistido em `localStorage` (chave `kurio:mocks:db:v1`); `POST /api/__reset`
  re-semeia o banco e é usado pelos testes E2E.
- Dois usuários: `ana@kurio.test` / `bruno@kurio.test` (senha `senha123`).

## Realtime / Socket.IO

- O banco expõe um event bus (`emitDb`/`onDbEvent`) que emite `nft.updated` e
  `order.updated` com `eventId` (dedupe) e `version`.
- `mocks/socket.ts` integra `@mswjs/socket.io-binding` (`ws.link` + `toSocketIo`)
  e encaminha esses eventos pelo protocolo Socket.IO.
- `lib/realtime.ts` assina o event bus do db e invalida as queries (`catalog`,
  `nft`, `order`) — com dedupe por `eventId`.
- **Limitação documentada**: o `WebSocketInterceptor` do MSW 2.15 não patcheou
  `globalThis.WebSocket` de forma confiável neste ambiente (a conexão Socket.IO
  caiu para a rede real e falhou o handshake). A reconciliação realtime usa o
  event bus in-page como fonte autoritativa; o transporte Socket.IO permanece
  implementado (`src/lib/socket.ts` + `src/mocks/socket.ts`) com
  `transports: ['websocket']` (long-polling não é interceptável).

## Checkout e idempotência

`POST /api/orders` exige header `Idempotency-Key`. A mesma chave + mesmo corpo
retorna o pedido existente (200); chave reutilizada com corpo diferente →
`409 IDEMPOTENCY_KEY_REUSED`. Cotação expirada ou carrinho alterado →
`409 QUOTE_STALE` com `details.currentTotalEth` para re-confirmação. O pedido é
criado como `pending` e confirmado após 1,2s (com reconciliação por leitura
para recuperação após refresh). A confirmação marca os NFTs como `sold`.

## Roteamento e catálogo URL-driven

A rota `/` valida os search params com zod e usa `parseSearch`/`stringifySearch`
próprios (strings simples, multi-seleção via vírgulas), evitando o
JSON-quoting de strings numéricas do default do TanStack Router. Estado do
catálogo = URL (`q`, `collections`, `networks`, `status`, `priceMin/Max`,
`sort`, `page`); facets vêm da API.

## Design system

Tokens congelados do Figma em `src/index.css` via Tailwind 4 `@theme`:
`ink #140D0A`, `surface-card #241612`, `surface-raised #2F1D15`,
`surface-dark #38220F`, `border #3F2319`, `border-soft #55321F`,
`primary #D28A4C`, `accent #E89B55`, `foreground #F5F1EB`,
`secondary #CFB28C`, `secondary-strong #B39463`; gradientes CTA/FAB/promo/apply;
raios (pill 40, sheet 31, card 15, field 10, modal 5); Roboto Mono 400/500/700.
