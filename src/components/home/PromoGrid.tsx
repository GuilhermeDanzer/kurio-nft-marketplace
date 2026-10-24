import { ArrowRight } from 'lucide-react'
import { promos } from '@/content/home'
import { heroArt, nftArtwork04 } from '@/lib/assets'

const promoArt = [heroArt, nftArtwork04]

export function PromoGrid() {
  return (
    <section className="flex flex-col gap-7 lg:flex-row lg:justify-between">
      {promos.map((p, i) => (
        <div key={p.id} className="flex h-[250px] w-full shrink-0 overflow-hidden rounded-[8px] bg-surface-card lg:w-[586px]">
          <img
            src={promoArt[i % promoArt.length]}
            alt=""
            className="h-[250px] w-[200px] shrink-0 rounded-[17px] object-cover lg:w-[287px]"
          />
          <div className="flex flex-1 flex-col items-start justify-center gap-3 px-6">
            <h3 className="text-[18px] font-bold leading-[24px] text-foreground">
              {p.title[0]}
              <br />
              {p.title[1]}
            </h3>
            <p className="text-[14px] leading-[24px] text-secondary">{p.body}</p>
            <a
              href="#catalogo"
              className="mt-2 inline-flex h-10 items-center gap-2 rounded-[6px] bg-primary px-9 text-[14px] font-medium leading-[20px] text-ink transition-colors hover:brightness-110"
            >
              {p.cta} <ArrowRight className="size-[18px]" />
            </a>
          </div>
        </div>
      ))}
    </section>
  )
}
