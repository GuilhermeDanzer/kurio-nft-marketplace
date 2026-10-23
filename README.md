# KURIO — NFT Marketplace

Marketplace curado de NFTs, com frontend de produção em React/TypeScript e um
backend **mockado no navegador** (MSW + Socket.IO), deployável de forma 100%
estática no GitHub Pages.

## Demonstração

- **Deploy**: https://guilhermedanzer.github.io/kurio-nft-marketplace/

## Telas

Home/catálogo (URL-driven), detalhes do NFT, carrinho, checkout, confirmação,
login/cadastro (modais), perfil e carteiras — desktop (1440) e mobile (390),
com fidelity ao design system do Figma (Roboto Mono, paleta KURIO).

## Stack

React 19 · TypeScript 5.9 (strict) · Vite 7 · TanStack Router + Query ·
Axios · Zod · MSW 2 (`@mswjs/socket.io-binding`) · Socket.IO client ·
Tailwind CSS 4 · Radix/shadcn · decimal.js · Playwright · Lighthouse.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # http://localhost:4173
```

O backend é mockado: os dados (24 NFTs, 9 coleções, 3 redes, 2 usuários) vivem
em `localStorage` e são resetáveis via `POST /api/__reset`.

### Credenciais de teste

| E-mail | Senha |
| --- | --- |
| `ana@kurio.test` | `senha123` |
| `bruno@kurio.test` | `senha123` |

## Scripts

```bash
npm run typecheck   # tsc strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
npm run lint        # eslint (0 errors)
npm run test:e2e    # Playwright — 75 testes (desktop + mobile)
npm run lighthouse  # 3 runs × 2 páginas × 2 perfis → reports/lighthouse/
```

## Documentação

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — camadas, contratos, mock, realtime, idempotência.
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — etapas S1–S12, comandos, decisões, limitações.
- [`REQUIREMENTS_TRACEABILITY.md`](REQUIREMENTS_TRACEABILITY.md) — telas, requisitos e evidências de teste.

## Deploy

GitHub Pages (project site) via workflow `.github/workflows/deploy.yml`:
build com `BASE_PATH='/kurio-nft-marketplace/'` + router `basepath` + `404.html`
copiado de `index.html` (deep links e refresh funcionam).

## Limitações conhecidas

1. O `WebSocketInterceptor` do MSW 2.15 não patcheou `globalThis.WebSocket` de
   forma confiável no navegador, então o transporte Socket.IO (implementado em
   `src/mocks/socket.ts` + `src/lib/socket.ts`) não conecta de fato; o realtime
   usa o event bus in-page do banco mock como fonte autoritativa.
2. Lighthouse mobile na página de detalhe (82) fica abaixo do alvo 90 por conta
   do cold-start do service worker do MSW + parse do bundle em CPU throttled.
3. Duas telas Figma (Cadastro desktop/mobile) foram cobertas por render +
   espelhamento do Login (cota da API de metadata esgotada).
