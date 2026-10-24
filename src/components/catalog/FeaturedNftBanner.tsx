import { heroArt } from '@/lib/assets'

/**
 * Static marketing banner that sits under the filter card in the catalog
 * sidebar.
 */
export function FeaturedNftBanner() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[8px] bg-gradient-to-b from-primary/10 to-primary/[0.03] pt-6 pb-1">
      <p className="px-5 text-center text-[24px] font-bold leading-[32px] tracking-[0.1em] text-accent">
        NFT EM DESTAQUE
      </p>
      <p className="text-center text-[22px] font-bold leading-[16px] tracking-[0.1em] text-foreground">
        OFERTA LIMITADA
      </p>
      <img
        src={heroArt}
        alt="NFT em destaque"
        className="h-[368px] w-full rounded-[22px] object-cover"
      />
    </div>
  )
}
