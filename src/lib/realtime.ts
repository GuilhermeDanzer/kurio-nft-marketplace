import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { onDbEvent } from '@/mocks/store'

const seenEvents = new Set<string>()
const MAX_SEEN = 200

/**
 * Realtime reconciliation for the mocked backend.
 *
 * The authoritative source in this single-page mock is the in-memory db
 * event bus (`emitDb`/`onDbEvent`), which fires `nft.updated` / `order.updated`
 * with a monotonic `eventId` used for dedupe. The Socket.IO transport (MSW +
 * `@mswjs/socket.io-binding`) forwards the exact same events; see
 * `src/mocks/socket.ts` and `src/lib/socket.ts`.
 */
export function useRealtime() {
  const qc = useQueryClient()

  useEffect(() => {
    function dedupe(eventId: unknown): boolean {
      if (typeof eventId !== 'string') return false
      if (seenEvents.has(eventId)) return true
      seenEvents.add(eventId)
      if (seenEvents.size > MAX_SEEN) seenEvents.clear()
      return false
    }

    function onNft(payload: { eventId?: string; nftId?: string }) {
      if (dedupe(payload?.eventId)) return
      void qc.invalidateQueries({ queryKey: ['catalog'] })
      if (payload?.nftId) void qc.invalidateQueries({ queryKey: ['nft', payload.nftId] })
    }

    function onOrder(payload: { eventId?: string; orderId?: string }) {
      if (dedupe(payload?.eventId)) return
      if (payload?.orderId) void qc.invalidateQueries({ queryKey: ['order', payload.orderId] })
    }

    const offBus = onDbEvent((name, payload) => {
      if (name === 'nft.updated') onNft(payload as { eventId?: string; nftId?: string })
      if (name === 'order.updated') onOrder(payload as { eventId?: string; orderId?: string })
    })

    return () => offBus()
  }, [qc])
}
