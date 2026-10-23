import type { Socket } from 'socket.io-client'

let socket: Socket | null = null
let loading: Promise<Socket> | null = null

/**
 * Returns a singleton Socket.IO client bound to the mocked `/socket.io`
 * endpoint. `transports: ['websocket']` is required — MSW cannot intercept
 * the long-polling transport.
 *
 * socket.io-client is loaded lazily AFTER `worker.start()` has patched
 * `globalThis.WebSocket`; engine.io-client captures the WebSocket constructor
 * at module evaluation time, so a static import would pin the *native*
 * constructor and bypass MSW's WebSocket interception.
 */
export function getSocket(): Promise<Socket> {
  if (socket) return Promise.resolve(socket)
  if (loading) return loading

  loading = import('socket.io-client').then(({ io }) => {
    socket = io({
      path: `${import.meta.env.BASE_URL}socket.io`,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 5000,
    })
    socket.on('connect', () => {
      // Debug hook used by the Playwright realtime spec to prove the
      // MSW Socket.IO binding established a live connection.
      ;(window as unknown as { __socketConnected?: boolean }).__socketConnected = true
    })
    socket.on('connect_error', () => {
      ;(window as unknown as { __socketConnected?: boolean }).__socketConnected = false
    })
    return socket
  })

  return loading
}
