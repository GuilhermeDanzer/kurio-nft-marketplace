import { useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { catalogApi } from '@/lib/api/client'
import { ApiError } from '@/lib/api/http'
import { useCart } from '@/lib/cart'
import { useCollections } from '@/lib/collections'
import { formatEth } from '@/lib/utils'
import { makeArtDataUri } from '@/mocks/art'
import { FavoriteButton } from '@/components/catalog/FavoriteButton'
import { RatingBadge } from '@/components/catalog/RatingBadge'
import { EditionChips } from '@/components/catalog/EditionChips'
import { QuantityStepper } from '@/components/catalog/QuantityStepper'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function maxQuantity(editionType: string): number {
  return editionType === 'unique' ? 1 : 5
}

export function NftDetailPage() {
  const { nftId } = useParams({ strict: false }) as { nftId: string }
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { data: collections } = useCollections()
  const [quantity, setQuantity] = useState(1)
  const [slide, setSlide] = useState(0)

  const { data: nft, isLoading, isError, error } = useQuery({
    queryKey: ['nft', nftId],
    queryFn: () => catalogApi.byId(nftId),
  })

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-44 pt-8 sm:px-6 md:pb-8" aria-busy="true" aria-label="Carregando NFT">
        <Skeleton className="mb-6 h-4 w-20" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-[15px]" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full rounded-[15px]" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }
  if (isError) {
    const notFound = error instanceof ApiError && error.code === 'NOT_FOUND'
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-xl font-bold text-foreground">{notFound ? 'NFT não encontrado.' : 'Erro ao carregar NFT.'}</p>
        <p className="text-sm text-secondary">
          {notFound ? 'Este item pode ter sido removido ou vendido.' : 'Tente novamente em instantes.'}
        </p>
        <Link to="/" className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-ink">
          <ArrowLeft className="size-4" /> Voltar ao catálogo
        </Link>
      </div>
    )
  }
  if (!nft) return null

  const unavailable = nft.status !== 'available'
  const collectionName = collections?.find((c) => c.id === nft.collectionId)?.name ?? '—'
  const slides = [nft.imageUrl, makeArtDataUri(`${nft.id}-b`, nft.tokenId), makeArtDataUri(`${nft.id}-c`, nft.tokenId)]

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-44 pt-8 sm:px-6 md:pb-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-[15px] border border-border bg-surface-card">
            <img src={slides[slide]} alt={nft.name} className="aspect-square w-full object-cover" />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-secondary">
              {slide + 1}/{slides.length}
            </span>
          </div>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Ver imagem ${i + 1}`}
                className={`overflow-hidden rounded-[10px] border ${i === slide ? 'border-primary' : 'border-border'}`}
              >
                <img src={s} alt="" className="size-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{nft.name}</h1>
              <RatingBadge rating={nft.rating} count={nft.ratingCount} />
            </div>
            <FavoriteButton nftId={nft.id} />
          </div>

          <p className="text-sm leading-6 text-secondary">{nft.description}</p>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">Edição</span>
            <div className="flex gap-2">
              <EditionChips nft={nft} selected />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-[15px] border border-border bg-surface-card p-4">
            <InfoRow label="ID do token" value={nft.tokenId} />
            <InfoRow label="Coleção" value={collectionName} />
            <InfoRow label="Atributos" value={nft.attributes.join(', ')} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-accent">{formatEth(nft.priceEth)} ETH</span>
            <span className="text-xs uppercase tracking-wider text-secondary">Preço fixo</span>
          </div>

          <div className="flex items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} max={maxQuantity(nft.edition.type)} />
            <Button
              size="xl"
              className="flex-1 rounded-[40px]"
              variant={unavailable ? 'secondary' : 'gradient'}
              disabled={unavailable || addItem.isPending}
              onClick={() => {
                addItem.mutate({ nftId: nft.id, quantity })
                void navigate({ to: '/cart' })
              }}
            >
              <ShoppingBag className="size-5" />
              {unavailable ? 'Indisponível' : 'Adicionar ao carrinho'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-[76px] z-30 border-t border-border bg-surface-card px-6 py-4 shadow-modal md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-secondary">{nft.tokenId}</span>
            <span className="text-lg font-bold text-accent">{formatEth(nft.priceEth)} ETH</span>
          </div>
          <Button
            className="rounded-[40px]"
            variant={unavailable ? 'secondary' : 'gradient'}
            disabled={unavailable || addItem.isPending}
            onClick={() => {
              addItem.mutate({ nftId: nft.id, quantity })
              void navigate({ to: '/cart' })
            }}
          >
            {unavailable ? 'Indisponível' : 'Comprar NFT'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-secondary-strong">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}
