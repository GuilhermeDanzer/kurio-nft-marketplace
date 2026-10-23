import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { NetworkId, WalletType } from '@/lib/contracts'
import { walletsApi } from '@/lib/api/client'
import { useAuth } from './auth'

export function useWallets() {
  const { token, status } = useAuth()
  return useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsApi.list(token!),
    enabled: status === 'authenticated',
  })
}

export function useAddWallet() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { type: WalletType; address: string; networkId: NetworkId }) =>
      walletsApi.add(token!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}

export function useRemoveWallet() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => walletsApi.remove(token!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}

export function useSetDefaultWallet() {
  const { token } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => walletsApi.setDefault(token!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}
