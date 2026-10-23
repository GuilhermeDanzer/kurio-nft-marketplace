import { Link } from '@tanstack/react-router'
import type { Nft } from '@/lib/contracts'
import { formatEth } from '@/lib/utils'
import { FavoriteButton } from './FavoriteButton'
import { RatingBadge } from './RatingBadge'
import { EditionChips } from './EditionChips'

export function NftCard({ nft }: { nft: Nft }) {
  const sold = nft.status === 'sold'
  return (
    <Link
      to="/nft/$nftId"
      params={{ nftId: nft.id }}
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[15px]"
    >
      <div className="relative overflow-hidden rounded-[15px] border border-border bg-surface-card">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-border bg-surface-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
              Vendido
            </span>
          </div>
        )}
        {!sold && <FavoriteButton nftId={nft.id} className="absolute right-2 top-2" />}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-foreground">{nft.name}</h3>
          <EditionChips nft={nft} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-accent">{formatEth(nft.priceEth)} ETH</span>
          <RatingBadge rating={nft.rating} count={nft.ratingCount} />
        </div>
      </div>
    </Link>
  )
}
