import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import { onDbEvent } from './store'

/**
 * Socket.IO mock over MSW's WebSocket interception.
 *
 * The `@mswjs/socket.io-binding` handles Engine.IO/Socket.IO framing, the
 * initial `0{...}` open packet and the `40{...}` namespace ack. We simply
 * subscribe to the in-memory db event bus and forward `nft.updated` /
 * `order.updated` to every connected Socket.IO client.
 *
 * The app client MUST connect with `transports: ['websocket']` — MSW cannot
 * intercept the long-polling transport (documented limitation).
 */
const socketPath = /\/socket\.io\/?/
const link = ws.link(socketPath)

export const socketHandler = link.addEventListener('connection', (connection) => {
  const { client, server } = toSocketIo(connection)

  // Client → server: allow subscribing to channels (kept for parity).
  client.on('subscribe', (_event, channel) => {
    // Reserved for future filtering; currently all events are broadcast.
    void channel
  })

  // Server → client: forward db event bus.
  const off = onDbEvent((name, payload) => {
    server.emit(name, payload)
  })

  const rawClient = connection.client
  rawClient.addEventListener('close', () => off())
})
