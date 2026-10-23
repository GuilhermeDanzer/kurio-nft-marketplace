import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useQuote } from '@/lib/quote'
import { formatEth } from '@/lib/utils'
import { QuantityStepper } from '@/components/catalog/QuantityStepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'

export function CartPage() {
  const { cart, isLoading, setQuantity, removeItem, applyCoupon } = useCart()
  const { status } = useAuth()
  const { openLogin } = useAuthDialog()
  const { data: quote } = useQuote()
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const items = cart?.items ?? []

  function proceed() {
    if (status !== 'authenticated') {
      openLogin('/checkout')
      return
    }
    void navigate({ to: '/checkout' })
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">Seu carrinho</h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-[15px]" />
          <Skeleton className="h-20 w-full rounded-[15px]" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[15px] border border-border bg-surface-card p-12 text-center">
          <ShoppingBag className="size-10 text-secondary" />
          <p className="text-lg font-medium text-foreground">Seu carrinho está vazio.</p>
          <p className="text-sm text-secondary">Explore o catálogo e encontre sua próxima obra.</p>
          <Link to="/" className="inline-flex h-11 items-center rounded-[10px] bg-primary px-6 text-ink">
            Explorar NFTs
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.nftId} className="flex items-center gap-4 rounded-[15px] border border-border bg-surface-card p-4">
                <Link to="/nft/$nftId" params={{ nftId: item.nftId }} className="shrink-0">
                  <img src={item.nft.imageUrl} alt={item.nft.name} className="size-20 rounded-[10px] object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: item.nftId }}
                    className="block truncate font-medium text-foreground hover:text-accent"
                  >
                    {item.nft.name}
                  </Link>
                  <p className="text-sm text-secondary">{item.nft.tokenId}</p>
                  <p className="mt-1 text-sm font-bold text-accent">{formatEth(item.nft.priceEth)} ETH</p>
                  {item.nft.status !== 'available' && (
                    <p className="mt-1 text-xs font-medium text-red-300">Indisponível</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    aria-label={`Remover ${item.nft.name}`}
                    className="text-secondary hover:text-red-300"
                    onClick={() => removeItem.mutate(item.nftId)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(q) => setQuantity.mutate({ nftId: item.nftId, quantity: q })}
                    max={item.nft.edition.type === 'unique' ? 1 : 5}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-fit flex-col gap-4 rounded-[20px] border border-border bg-surface-card p-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="coupon" className="text-sm font-medium text-secondary">
                Código promocional
              </label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Digite o código…"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-10"
                />
                <Button
                  variant="gradient"
                  className="h-10 rounded-[40px]"
                  disabled={!code.trim() || applyCoupon.isPending}
                  onClick={() => applyCoupon.mutate(code.trim())}
                >
                  Aplicar
                </Button>
              </div>
              {cart?.couponCode && <p className="text-xs text-accent">Cupom ativo: {cart.couponCode}</p>}
            </div>

            <SummaryRow label="Subtotal" value={quote ? formatEth(quote.subtotalEth) : '—'} />
            <SummaryRow label="Desconto" value={quote ? `(-) ${formatEth(quote.discountEth)}` : '—'} />
            <SummaryRow label="Taxa de rede" value={quote ? formatEth(quote.networkFeeEth) : '—'} note="Taxa estimada" />
            <div className="my-1 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-2xl font-bold text-accent">
                {quote ? `${formatEth(quote.totalEth)} ETH` : '—'}
              </span>
            </div>

            <Button size="xl" className="rounded-[40px]" variant="gradient" onClick={proceed}>
              {status === 'authenticated' ? 'Finalizar compra' : 'Conectar e finalizar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-secondary">{label}</span>
      <span className="flex flex-col items-end">
        <span className="text-foreground">{value}</span>
        {note && <span className="text-xs text-accent">{note}</span>}
      </span>
    </div>
  )
}
