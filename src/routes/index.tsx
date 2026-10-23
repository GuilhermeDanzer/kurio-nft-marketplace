import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer'

const promos = [
  {
    title: 'Kurio Apes',
    subtitle: 'A coleção mais desejada da temporada',
    cta: 'Explorar coleção',
    seed: 'promo-apes',
  },
  {
    title: 'Novos artistas',
    subtitle: 'Descubra obras inéditas de criadores emergentes',
    cta: 'Ver lançamentos',
    seed: 'promo-artists',
  },
]

export function HomePage() {
  return (
    <div>
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-10 sm:px-6">
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-surface-card p-8 md:p-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Marketplace curado</span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-[43px] md:leading-[1.1]">
            Descubra, colecione e negocie arte digital.
          </h1>
          <p className="max-w-xl text-secondary">
            Obras verificadas na blockchain, curadoria de qualidade e uma experiência de compra simples e segura.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex h-12 items-center gap-2 rounded-[40px] bg-gradient-cta px-8 text-ink transition hover:brightness-110">
              Explorar agora <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 grid w-full max-w-[1200px] gap-4 px-4 sm:grid-cols-2 sm:px-6">
        {promos.map((p) => (
          <div key={p.title} className="relative overflow-hidden rounded-[8px] bg-gradient-promo p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
              <p className="max-w-xs text-sm text-secondary">{p.subtitle}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent">
                {p.cta} <ArrowRight className="size-4" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <CatalogExplorer />
    </div>
  )
}
