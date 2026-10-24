import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { catalogApi, type CatalogQuery } from '@/lib/api/client'
import type { CatalogSort } from '@/lib/contracts'
import { cn } from '@/lib/utils'
import { NftCard } from './NftCard'
import { FacetsSidebar, type FacetsValue } from './FacetsSidebar'
import { FeaturedNftBanner } from './FeaturedNftBanner'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HomeSearch {
  q: string | undefined
  categories: string | undefined
  networks: string | undefined
  priceMin: string | undefined
  priceMax: string | undefined
  sort: string | undefined
  page: string | undefined
  tab: string | undefined
}

const split = (s?: string) => (s ? s.split(',').filter(Boolean) : [])
const join = (arr: string[]) => (arr.length ? arr.join(',') : undefined)

const tabs = [
  { id: 'todos', label: 'Todos os NFTs' },
  { id: 'novos', label: 'Novos lançamentos' },
  { id: 'alta', label: 'Em alta' },
] as const

export function CatalogExplorer({
  mobileFiltersOpen = false,
}: {
  mobileFiltersOpen?: boolean
}) {
  const search = useSearch({ strict: false }) as HomeSearch
  const navigate = useNavigate()

  function patch(p: Partial<HomeSearch>) {
    void navigate({ to: '/', search: (prev) => ({ ...(prev as HomeSearch), ...p }) })
  }

  const tab = search.tab ?? 'todos'
  const sort: CatalogSort = (search.sort as CatalogSort) ?? (tab === 'alta' ? 'rating' : 'recent')

  const query: CatalogQuery = {
    q: search.q || undefined,
    categories: split(search.categories),
    networks: split(search.networks) as CatalogQuery['networks'],
    priceMin: search.priceMin || undefined,
    priceMax: search.priceMax || undefined,
    sort,
    page: Math.max(1, Number(search.page || 1)),
    pageSize: 9,
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['catalog', query],
    queryFn: () => catalogApi.list(query),
    placeholderData: (prev) => prev,
  })

  const facetsValue: FacetsValue = {
    categories: split(search.categories),
    networks: split(search.networks),
    priceMin: search.priceMin ?? '',
    priceMax: search.priceMax ?? '',
  }

  const activeTab = search.sort ? null : tab

  const handleFacetsChange = (v: FacetsValue) =>
    patch({
      categories: join(v.categories),
      networks: join(v.networks),
      priceMin: v.priceMin || undefined,
      priceMax: v.priceMax || undefined,
      page: undefined,
    })

  const sidebar = (
    <>
      <FacetsSidebar facets={data?.facets ?? emptyFacets} value={facetsValue} onChange={handleFacetsChange} />
      <FeaturedNftBanner />
    </>
  )

  return (
    <section id="catalogo" className="w-full" aria-label="Explorar NFTs">
      {mobileFiltersOpen && <div className="mb-6 flex flex-col gap-6 lg:hidden">{sidebar}</div>}
      <div className="flex gap-12">
        <div className="hidden w-[310px] shrink-0 flex-col gap-6 lg:flex">{sidebar}</div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-end justify-between lg:mb-8">
            <div className="flex gap-5" role="tablist" aria-label="Filtros do catálogo">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => patch({ tab: t.id, sort: undefined, page: undefined })}
                  className="flex flex-col gap-2"
                >
                  <span
                    className={cn(
                      'text-[14px] font-medium leading-none transition-colors lg:text-[15px]',
                      activeTab === t.id ? 'text-accent' : 'text-foreground hover:text-accent',
                    )}
                  >
                    {t.label}
                  </span>
                  <span className={cn('h-[2px] w-full rounded-full', activeTab === t.id ? 'bg-primary' : 'bg-transparent')} />
                </button>
              ))}
            </div>

            <div className="hidden lg:block">
              <SortSelect value={sort} onChange={(s) => patch({ sort: s, tab: undefined, page: undefined })} />
            </div>
          </div>

          {isLoading ? (
            <GridSkeleton />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : data && data.items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div
                className={cn(
                  'grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]',
                  isFetching && 'opacity-60 transition-opacity',
                )}
                data-testid="nft-grid"
              >
                {data?.items.map((nft) => <NftCard key={nft.id} nft={nft} />)}
              </div>

              {data && data.totalPages > 1 && (
                <Pagination page={data.page} totalPages={data.totalPages} onPage={(page) => patch({ page: String(page) })} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

const emptyFacets = {
  categories: [],
  networks: [],
  price: { minEth: '0', maxEth: '0' },
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label="Ordenar"
        className="h-auto w-auto gap-2 border-0 bg-transparent p-0 shadow-none focus:ring-0 data-[placeholder]:text-foreground [&>svg]:hidden"
      >
        <span className="flex items-center gap-2 text-[15px] leading-[16px] text-foreground">
          <span className="text-secondary">Ordenar por:</span>
          <SelectValue placeholder="Listados recentemente" />
        </span>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="recent">Listados recentemente</SelectItem>
        <SelectItem value="price_asc">Menor preço</SelectItem>
        <SelectItem value="price_desc">Maior preço</SelectItem>
        <SelectItem value="rating">Melhor avaliação</SelectItem>
        <SelectItem value="name">Nome (A–Z)</SelectItem>
      </SelectContent>
    </Select>
  )
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]"
      aria-busy="true"
      aria-label="Carregando NFTs"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-[300px] w-full rounded-[8px]" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[8px] border border-border bg-surface-card p-12 text-center">
      <p className="text-foreground">Não foi possível carregar o catálogo.</p>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[8px] border border-border bg-surface-card p-12 text-center">
      <p className="font-medium text-foreground">Nenhum NFT encontrado.</p>
      <p className="text-sm text-secondary">Ajuste os filtros ou a busca para ver mais resultados.</p>
    </div>
  )
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className="mt-12 flex items-center justify-end gap-2" aria-label="Paginação">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex h-[35px] w-[35px] items-center justify-center rounded-[4px] text-[18px] leading-none transition-colors',
            p === page ? 'bg-primary font-bold text-ink' : 'border border-border text-foreground hover:bg-surface-card',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima"
        className="flex h-[35px] w-[35px] items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-[18px]" />
      </button>
    </nav>
  )
}

