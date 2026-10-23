import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { socketHandler } from './socket'

export const worker = setupWorker(...handlers, socketHandler)

/**
 * MSW is intentionally enabled in dev AND production builds: this demo's
 * "backend" is entirely mocked, so the deployed GitHub Pages site is fully
 * functional without a live server.
 */
export async function enableMocking(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    quiet: true,
  })
}
