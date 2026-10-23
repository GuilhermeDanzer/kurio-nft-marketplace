import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { catalogApi, type CatalogQuery } from '@/lib/api/client'
import type { CatalogSort } from '@/lib/contracts'
import { NftCard } from './NftCard'
import { FacetsSidebar, type FacetsValue } from './FacetsSidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HomeSearch {
  q: string | undefined
  collections: string | undefined
  networks: string | undefined
  status: string | undefined
  priceMin: string | undefined
  priceMax: string | undefined
  sort: string | undefined
  page: string | undefined
}

const split = (s?: string) => (s ? s.split(',').filter(Boolean) : [])
const join = (arr: string[]) => (arr.length ? arr.join(',') : undefined)

export function CatalogExplorer() {
  const search = useSearch({ strict: false }) as HomeSearch
  const navigate = useNavigate()

  function patch(p: Partial<HomeSearch>) {
    void navigate({ to: '/', search: (prev) => ({ ...(prev as HomeSearch), ...p }) })
  }

  const query: CatalogQuery = {
    q: search.q || undefined,
    collections: split(search.collections),
    networks: split(search.networks) as CatalogQuery['networks'],
    status: split(search.status),
    priceMin: search.priceMin || undefined,
    priceMax: search.priceMax || undefined,
    sort: (search.sort as CatalogSort) || 'recent',
    page: Math.max(1, Number(search.page || 1)),
    pageSize: 12,
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['catalog', query],
    queryFn: () => catalogApi.list(query),
    placeholderData: (prev) => prev,
  })

  const facetsValue: FacetsValue = {
    collections: split(search.collections),
    networks: split(search.networks),
    status: split(search.status),
    priceMin: search.priceMin ?? '',
    priceMax: search.priceMax ?? '',
  }

  const hasActiveFilters =
    facetsValue.collections.length > 0 ||
    facetsValue.networks.length > 0 ||
    facetsValue.status.length > 0 ||
    facetsValue.priceMin !== '' ||
    facetsValue.priceMax !== '' ||
    Boolean(search.q)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6" aria-label="Explorar NFTs">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Explorar NFTs</h2>
          <p className="text-sm text-secondary">{data ? `${data.total} obras disponíveis` : 'Carregando catálogo…'}</p>
        </div>
        <div className="flex items-center gap-3">
          <SortSelect value={search.sort ?? 'recent'} onChange={(sort) => patch({ sort, page: undefined })} />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="hidden w-[310px] shrink-0 lg:block">
          <FacetsSidebar
            facets={data?.facets ?? emptyFacets}
            value={facetsValue}
            onChange={(v) =>
              patch({
                collections: join(v.collections),
                networks: join(v.networks),
                status: join(v.status),
                priceMin: v.priceMin || undefined,
                priceMax: v.priceMax || undefined,
                page: undefined,
              })
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                value={search.q ?? ''}
                onChange={(e) => patch({ q: e.target.value || undefined, page: undefined })}
                placeholder="Buscar por nome, coleção ou atributo…"
                aria-label="Buscar NFTs"
                className="h-12 w-full rounded-[10px] border border-border bg-surface-card pl-10 pr-4 text-sm text-foreground placeholder:text-secondary-strong focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() =>
                  patch({
                    q: undefined,
                    collections: undefined,
                    networks: undefined,
                    status: undefined,
                    priceMin: undefined,
                    priceMax: undefined,
                    page: undefined,
                  })
                }
              >
                <X className="size-4" /> Limpar filtros
              </Button>
            )}
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
                className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 ${isFetching ? 'opacity-60 transition-opacity' : ''}`}
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
  collections: [],
  networks: [],
  price: { minEth: '0', maxEth: '0' },
  statuses: [],
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]" aria-label="Ordenar">
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Mais recentes</SelectItem>
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5" aria-busy="true" aria-label="Carregando NFTs">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 p-2">
          <Skeleton className="aspect-square w-full rounded-[15px]" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[15px] border border-border bg-surface-card p-12 text-center">
      <p className="text-foreground">Não foi possível carregar o catálogo.</p>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[15px] border border-border bg-surface-card p-12 text-center">
      <p className="font-medium text-foreground">Nenhum NFT encontrado.</p>
      <p className="text-sm text-secondary">Ajuste os filtros ou a busca para ver mais resultados.</p>
    </div>
  )
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginação">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Anterior
      </Button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`flex size-9 items-center justify-center rounded-full text-sm ${p === page ? 'bg-primary font-bold text-ink' : 'text-secondary hover:bg-surface-card hover:text-foreground'}`}
        >
          {p}
        </button>
      ))}
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Próxima
      </Button>
    </nav>
  )
}

