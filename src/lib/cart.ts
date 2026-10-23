import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/client'
import { ApiError } from '@/lib/api/http'
import { useAuth } from './auth'
import { toast } from 'sonner'

export function useCart() {
  const { token, guestKey } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['cart', token, guestKey],
    queryFn: () => cartApi.get(token, guestKey),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['cart'] })

  const addItem = useMutation({
    mutationFn: (input: { nftId: string; quantity?: number }) =>
      cartApi.add(token, guestKey, input.nftId, input.quantity ?? 1),
    onSuccess: () => {
      invalidate()
      toast.success('Adicionado ao carrinho')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Erro ao adicionar.')
    },
  })

  const setQuantity = useMutation({
    mutationFn: (input: { nftId: string; quantity: number }) =>
      cartApi.setQuantity(token, guestKey, input.nftId, input.quantity),
    onSuccess: invalidate,
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Erro ao atualizar.')
    },
  })

  const removeItem = useMutation({
    mutationFn: (nftId: string) => cartApi.remove(token, guestKey, nftId),
    onSuccess: invalidate,
  })

  const applyCoupon = useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(token, guestKey, code),
    onSuccess: invalidate,
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : 'Cupom inválido.')
    },
  })

  return {
    cart: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    addItem,
    setQuantity,
    removeItem,
    applyCoupon,
  }
}
