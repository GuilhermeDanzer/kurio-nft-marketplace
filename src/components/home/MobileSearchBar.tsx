import { useNavigate, useSearch } from '@tanstack/react-router'
import { Filter, Search } from 'lucide-react'

/**
 * Mobile-only top search + filter bar (Figma "Mobile / Início").
 * The desktop equivalent lives in the sticky header.
 */
export function MobileSearchBar({ onToggleFilters }: { onToggleFilters: () => void }) {
  const search = useSearch({ strict: false }) as { q?: string }
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-[45px] min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-surface-card px-3">
        <Search className="size-4 shrink-0 text-secondary" />
        <input
          type="search"
          value={search.q ?? ''}
          onChange={(e) =>
            void navigate({
              to: '/',
              search: (prev) => ({ ...(prev as object), q: e.target.value || undefined, page: undefined }),
            })
          }
          aria-label="Buscar NFTs"
          placeholder="Explorar coleções"
          className="w-full bg-transparent text-[14px] font-bold leading-[16px] text-foreground placeholder:text-secondary focus:outline-none"
        />
      </div>
      <button
        type="button"
        aria-label="Filtros"
        onClick={onToggleFilters}
        className="flex size-[45px] shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(137deg,rgba(210,138,76,0.45)_0%,rgba(210,138,76,1)_100%)]"
      >
        <Filter className="size-5 text-ink" />
      </button>
    </div>
  )
}
