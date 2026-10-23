import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'
import { ordersApi } from '@/lib/api/client'
import { useAuth } from '@/lib/auth'
import { formatEth, shortenAddress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FullPageSpinner } from '@/components/ui/spinner'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'

export function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string }
  const { status, token } = useAuth()
  const { openLogin } = useAuthDialog()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.byId(token!, orderId),
    enabled: status === 'authenticated',
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 1000 : false),
  })

  if (status === 'guest') {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[560px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-lg font-bold text-foreground">Entre para acompanhar seu pedido.</p>
        <Button onClick={() => openLogin()}>Entrar</Button>
      </div>
    )
  }

  if (isLoading || !order) return <FullPageSpinner label="Carregando pedido…" />

  if (order.status === 'pending') {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[560px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <Loader2 className="size-10 animate-spin text-accent" />
        <h1 className="text-xl font-bold text-foreground">Processando transação…</h1>
        <p className="text-sm text-secondary">
          Aguarde a confirmação na blockchain. Esta janela atualiza automaticamente.
        </p>
        <p className="text-sm text-secondary">
          Total: <span className="font-bold text-accent">{formatEth(order.totalEth)} ETH</span>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[760px] flex-col items-center px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-14 text-accent" />
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Compra confirmada!</h1>
        <p className="max-w-md text-sm text-secondary">
          Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na
          rede.
        </p>
      </div>

      <div className="mt-10 w-full overflow-hidden rounded-[15px] border border-border bg-surface-card">
        <div className="border-b border-border bg-primary/10 p-6">
          <h2 className="text-base font-bold text-foreground">Detalhes da transação</h2>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.nftId} className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.name} className="size-12 rounded-[8px] object-cover" />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-secondary">x{item.quantity}</span>
                </div>
                <span className="text-sm text-foreground">{formatEth(item.unitPriceEth)} ETH</span>
              </div>
            ))}
          </div>

          <div className="my-1 h-px bg-border" />

          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Detail label="Pedido" value={`#${order.id.slice(0, 6).toUpperCase()}`} />
            <Detail label="Data" value={new Date(order.createdAt).toLocaleDateString('pt-BR')} />
            <Detail label="Total" value={`${formatEth(order.totalEth)} ETH`} />
            <Detail label="Carteira" value={order.wallet.type} />
          </dl>

          <div className="my-1 h-px bg-border" />

          <div className="flex flex-col gap-2 text-sm">
            <span className="text-secondary">Endereço</span>
            <span className="font-mono text-foreground">{shortenAddress(order.wallet.address, 10, 8)}</span>
            {order.txHash && (
              <>
                <span className="mt-2 text-secondary">Hash da transação</span>
                <span className="font-mono text-foreground">{shortenAddress(order.txHash, 10, 8)}</span>
              </>
            )}
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-primary px-4 py-3 text-sm font-medium text-ink"
          >
            Ver no Etherscan <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      <Link to="/" className="mt-8 text-sm text-accent hover:underline">
        Continuar explorando
      </Link>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-secondary">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  )
}
