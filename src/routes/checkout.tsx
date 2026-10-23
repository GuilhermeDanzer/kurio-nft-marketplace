import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useQuote } from '@/lib/quote'
import { useWallets } from '@/lib/wallets'
import { ordersApi } from '@/lib/api/client'
import { ApiError } from '@/lib/api/http'
import { formatEth } from '@/lib/utils'
import { idempotencyKey } from '@/lib/id'
import type { WalletType } from '@/lib/contracts'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'
import { toast } from 'sonner'

export function CheckoutPage() {
  const { status, token } = useAuth()
  const { openLogin } = useAuthDialog()
  const { data: quote, refetch: refetchQuote } = useQuote()
  const { data: wallets } = useWallets()
  const navigate = useNavigate()
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [staleTotal, setStaleTotal] = useState<string | null>(null)
  const idemKey = useRef(idempotencyKey())

  if (status === 'guest') {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[560px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-lg font-bold text-foreground">Você precisa entrar para finalizar.</p>
        <Button onClick={() => openLogin('/checkout')}>Entrar e continuar</Button>
      </div>
    )
  }

  const selectedWallet = wallets?.find((w) => w.type === walletType) ?? wallets?.find((w) => w.isDefault) ?? wallets?.[0]
  const total = staleTotal ?? (quote ? formatEth(quote.totalEth) : null)

  async function submit() {
    if (!quote || !token || !selectedWallet) return
    setSubmitting(true)
    setStaleTotal(null)
    try {
      const order = await ordersApi.create(token, {
        idempotencyKey: idemKey.current,
        quoteId: quote.id,
        walletType: selectedWallet.type,
      })
      void navigate({ to: '/order/$orderId', params: { orderId: order.id } })
    } catch (err) {
      if (err instanceof ApiError && err.code === 'QUOTE_STALE') {
        const current = err.details?.currentTotalEth
        setStaleTotal(typeof current === 'string' ? formatEth(current) : null)
        idemKey.current = idempotencyKey()
        toast.warning('A cotação mudou. Revise e confirme novamente.')
        void refetchQuote()
      } else if (err instanceof ApiError && err.code === 'IDEMPOTENCY_KEY_REUSED') {
        idemKey.current = idempotencyKey()
        toast.error('Tentativa duplicada. Tente novamente.')
      } else if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error('Não foi possível finalizar a compra.')
      }
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar ao carrinho
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">Finalizar compra</h1>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-[15px] border border-border bg-surface-card p-6">
          <h2 className="text-base font-bold text-foreground">Itens</h2>
          <div className="flex flex-col gap-3">
            {quote ? (
              <div className="flex flex-col gap-2 text-sm">
                <SummaryRow label="Subtotal" value={`${formatEth(quote.subtotalEth)} ETH`} />
                <SummaryRow label="Desconto" value={`(-) ${formatEth(quote.discountEth)} ETH`} />
                <SummaryRow label="Taxa de rede" value={`${formatEth(quote.networkFeeEth)} ETH`} />
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[15px] border border-border bg-surface-card p-6">
          <h2 className="text-base font-bold text-foreground">Carteira e rede</h2>
          <RadioGroup value={selectedWallet?.type} onValueChange={(v) => setWalletType(v as WalletType)} className="gap-3">
            {(wallets ?? []).map((w) => (
              <label
                key={w.id}
                className="flex cursor-pointer items-center gap-3 rounded-[15px] border border-border bg-surface-card p-4 transition-colors has-[[data-state=checked]]:border-primary"
              >
                <RadioGroupItem value={w.type} />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground capitalize">{w.type}</span>
                  <span className="text-xs text-secondary">{w.address}</span>
                </div>
                {w.isDefault && <span className="text-xs text-accent">Padrão</span>}
              </label>
            ))}
          </RadioGroup>
          {wallets && wallets.length === 0 && (
            <p className="text-sm text-secondary">
              Nenhuma carteira cadastrada.{' '}
              <Link to="/account/wallets" className="text-accent hover:underline">
                Adicionar carteira
              </Link>
            </p>
          )}
        </section>

        {staleTotal && (
          <div className="flex items-start gap-2 rounded-[10px] border border-primary/40 bg-primary/10 p-4 text-sm text-accent">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            A cotação foi atualizada. Novo total: <strong>{staleTotal} ETH</strong>. Revise e confirme.
          </div>
        )}

        <div className="flex items-center justify-between rounded-[15px] border border-border bg-surface-card p-6">
          <div className="flex flex-col">
            <span className="text-sm text-secondary">Total</span>
            <span className="text-3xl font-bold text-accent">{total ? `${total} ETH` : '—'}</span>
          </div>
          <Button
            size="xl"
            className="rounded-[40px]"
            variant="gradient"
            disabled={submitting || !quote || !selectedWallet}
            onClick={() => void submit()}
          >
            {submitting ? <Spinner /> : 'Confirmar compra'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-secondary">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
