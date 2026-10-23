import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Star, Trash2 } from 'lucide-react'
import { useWallets, useAddWallet, useRemoveWallet, useSetDefaultWallet } from '@/lib/wallets'
import { useAuth } from '@/lib/auth'
import { ApiError } from '@/lib/api/http'
import { shortenAddress } from '@/lib/utils'
import type { NetworkId, WalletType } from '@/lib/contracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AccountSidebar } from '@/components/layout/AccountSidebar'

export function WalletsPage() {
  const { status } = useAuth()
  const { data: wallets, isLoading } = useWallets()
  const addWallet = useAddWallet()
  const removeWallet = useRemoveWallet()
  const setDefault = useSetDefaultWallet()

  const [type, setType] = useState<WalletType>('metamask')
  const [networkId, setNetworkId] = useState<NetworkId>('ethereum')
  const [address, setAddress] = useState('')

  if (status === 'guest') {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[560px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <p className="text-lg font-bold text-foreground">Entre para gerenciar carteiras.</p>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast.error('Endereço inválido (use 0x…).')
      return
    }
    try {
      await addWallet.mutateAsync({ type, address, networkId })
      setAddress('')
      toast.success('Carteira adicionada.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erro ao adicionar.')
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6">
      <AccountSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carteiras</h1>
          <p className="text-sm text-secondary">Gerencie as carteiras usadas nas compras.</p>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <p className="text-sm text-secondary">Carregando…</p>
          ) : (wallets ?? []).length === 0 ? (
            <p className="text-sm text-secondary">Nenhuma carteira cadastrada.</p>
          ) : (
            (wallets ?? []).map((w) => (
              <div key={w.id} className="flex items-center gap-4 rounded-[15px] border border-border bg-surface-card p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-surface-raised text-sm font-bold text-accent">
                  {w.type.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize text-foreground">{w.type}</span>
                    {w.isDefault && <Star className="size-3.5 fill-accent text-accent" />}
                  </div>
                  <span className="font-mono text-xs text-secondary">{shortenAddress(w.address, 10, 8)}</span>
                </div>
                <span className="text-xs uppercase text-secondary">{w.networkId}</span>
                {!w.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => setDefault.mutate(w.id)}>
                    Tornar padrão
                  </Button>
                )}
                <button
                  type="button"
                  aria-label="Remover carteira"
                  className="text-secondary hover:text-red-300"
                  onClick={() => removeWallet.mutate(w.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={submit} className="flex max-w-xl flex-col gap-4 rounded-[15px] border border-border bg-surface-card p-6">
          <h2 className="text-base font-bold text-foreground">Adicionar carteira</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as WalletType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metamask">MetaMask</SelectItem>
                  <SelectItem value="walletconnect">WalletConnect</SelectItem>
                  <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rede</Label>
              <Select value={networkId} onValueChange={(v) => setNetworkId(v as NetworkId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wallet-address">Endereço</Label>
            <Input
              id="wallet-address"
              placeholder="0x…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={addWallet.isPending} className="w-fit">
            <Plus className="size-4" /> Adicionar
          </Button>
        </form>
      </div>
    </div>
  )
}
