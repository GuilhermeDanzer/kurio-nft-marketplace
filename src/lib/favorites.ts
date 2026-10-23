import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoritesApi } from '@/lib/api/client'
import { useAuth } from './auth'

export function useFavorites() {
  const { token, status } = useAuth()
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(token!),
    enabled: status === 'authenticated',
  })
}

export function useToggleFavorite() {
  const { token } = useAuth()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: { nftId: string; isFavorite: boolean }) =>
      input.isFavorite
        ? favoritesApi.remove(token!, input.nftId)
        : favoritesApi.add(token!, input.nftId),
    onMutate: async ({ nftId, isFavorite }) => {
      await qc.cancelQueries({ queryKey: ['favorites'] })
      const prev = qc.getQueryData<string[]>(['favorites'])
      qc.setQueryData<string[]>(['favorites'], (old) =>
        isFavorite ? (old ?? []).filter((id) => id !== nftId) : [...(old ?? []), nftId],
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['favorites'], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}
