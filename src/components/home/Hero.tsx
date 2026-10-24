import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { hero, heroMobile } from '@/content/home'
import { heroArt } from '@/lib/assets'

export function Hero() {
  return (
    <section className="relative flex min-h-[190px] w-full items-center justify-between overflow-hidden rounded-[12px] bg-surface-card px-4 py-4 lg:min-h-[450px] lg:rounded-[24px] lg:bg-gradient-to-r lg:from-primary/10 lg:via-ink lg:to-ink lg:px-10 lg:py-0">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 lg:w-[600px] lg:flex-none lg:items-end lg:gap-11">
        <div className="flex w-full flex-col gap-2 lg:gap-3">
          <p className="text-[12px] leading-[16px] text-foreground lg:text-[14px] lg:font-medium">
            {hero.eyebrow}
          </p>
          <h1 className="text-[18px] font-bold leading-[29px] tracking-[0.1em] text-foreground lg:text-[43px] lg:leading-[70px]">
            <span className="lg:hidden">
              {heroMobile.title[0]}
              <br />
              {heroMobile.title[1]}
            </span>
            <span className="hidden lg:inline">
              {hero.title[0]}
              <br />
              {hero.title[1]}
            </span>
          </h1>
          <p className="max-w-[557px] text-[12px] leading-[18px] text-secondary lg:text-[14px] lg:leading-[24px]">
            <span className="lg:hidden">{heroMobile.body}</span>
            <span className="hidden lg:inline">{hero.body}</span>
          </p>

          <Link
            to="/"
            hash="catalogo"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-accent lg:hidden"
          >
            {hero.cta} <ArrowRight className="size-3" />
          </Link>
          <Link
            to="/"
            hash="catalogo"
            className="hidden h-10 items-center justify-center rounded-[6px] bg-primary px-9 text-[16px] font-bold leading-[20px] text-ink transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:inline-flex"
          >
            {hero.cta}
          </Link>
        </div>
        <span className="hidden h-2 w-10 rounded-full bg-primary/60 lg:block" />
      </div>

      <img
        src={heroArt}
        alt="Arte digital em destaque"
        className="ml-4 h-[138px] w-[138px] shrink-0 rounded-[16px] object-cover lg:ml-0 lg:h-[450px] lg:w-[450px] lg:rounded-[24px]"
      />
    </section>
  )
}

