import { Link } from '@tanstack/react-router'
import type { Nft } from '@/lib/contracts'
import { formatEth } from '@/lib/utils'
import { FavoriteButton } from './FavoriteButton'

export function NftCard({ nft }: { nft: Nft }) {
  const sold = nft.status === 'sold'
  return (
    <Link
      to="/nft/$nftId"
      params={{ nftId: nft.id }}
      className="group flex w-full flex-col gap-2 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:gap-3"
    >
      <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[20px] bg-surface-card lg:h-[300px] lg:rounded-[8px]">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 lg:h-[250px] lg:w-[250px] lg:rounded-[15px]"
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-border bg-surface-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
              Vendido
            </span>
          </div>
        )}
        {!sold && <FavoriteButton nftId={nft.id} className="absolute right-2 top-2 size-7 lg:hidden" />}
      </div>

      <div className="flex items-center justify-between gap-2 lg:flex-col lg:items-start lg:gap-1">
        <h3 className="truncate text-[14px] leading-[16px] text-foreground lg:text-[16px]">{nft.name}</h3>
        <p className="shrink-0 text-[16px] font-bold leading-[16px] text-accent lg:text-[18px]">
          {formatEth(nft.priceEth)} ETH
        </p>
      </div>
    </Link>
  )
}

