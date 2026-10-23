import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '@/lib/api/client'

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => catalogApi.collections(),
    staleTime: 5 * 60_000,
  })
}
