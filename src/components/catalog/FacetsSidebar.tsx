import { useEffect, useState } from 'react'
import type { Facets, FacetOption } from '@/lib/contracts'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { PriceRangeSlider } from './PriceRangeSlider'

export interface FacetsValue {
  categories: string[]
  networks: string[]
  priceMin: string
  priceMax: string
}

function formatBr(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function FacetsSidebar({
  facets,
  value,
  onChange,
}: {
  facets: Facets
  value: FacetsValue
  onChange: (v: FacetsValue) => void
}) {
  const min = Number(facets.price.minEth || '0')
  const max = Number(facets.price.maxEth || '0')
  const [draft, setDraft] = useState<[number, number] | null>(null)

  useEffect(() => {
    setDraft(null)
  }, [facets.price.minEth, facets.price.maxEth])

  const low = draft ? draft[0] : value.priceMin ? Number(value.priceMin) : min
  const high = draft ? draft[1] : value.priceMax ? Number(value.priceMax) : max

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  return (
    <aside aria-label="Filtros" className="flex flex-col gap-6">
      <div className="flex flex-col gap-10 rounded-[8px] bg-surface-card p-5">
        <FacetGroup title="Coleções">
          <ul className="flex flex-col pl-3">
            {facets.categories.map((c) => (
              <FacetCheck
                key={c.id}
                option={c}
                checked={value.categories.includes(c.id)}
                countBold
                onToggle={() => onChange({ ...value, categories: toggle(value.categories, c.id) })}
              />
            ))}
          </ul>
        </FacetGroup>

        <FacetGroup title="Faixa de preço">
          <div className="flex flex-col gap-3 pl-3">
            <PriceRangeSlider
              min={min}
              max={max}
              low={low}
              high={high}
              onChange={(l, h) => setDraft([l, h])}
            />
            <p className="text-[15px] leading-[16px] text-foreground">
              Preço: {formatBr(Math.min(low, high))} - {formatBr(Math.max(low, high))} ETH
            </p>
            <button
              type="button"
              onClick={() => onChange({ ...value, priceMin: String(Math.min(low, high)), priceMax: String(Math.max(low, high)) })}
              className="w-fit rounded-[6px] bg-primary px-3 py-2 text-[16px] font-bold leading-[20px] text-ink transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Aplicar
            </button>
          </div>
        </FacetGroup>

        <FacetGroup title="Rede">
          <ul className="flex flex-col pl-3">
            {facets.networks.map((n) => (
              <FacetCheck
                key={n.id}
                option={n}
                checked={value.networks.includes(n.id)}
                onToggle={() => onChange({ ...value, networks: toggle(value.networks, n.id) })}
              />
            ))}
          </ul>
        </FacetGroup>
      </div>
    </aside>
  )
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[18px] font-bold leading-[16px] text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function FacetCheck({
  option,
  checked,
  countBold = false,
  onToggle,
}: {
  option: FacetOption
  checked: boolean
  countBold?: boolean
  onToggle: () => void
}) {
  return (
    <label
      className={cn(
        'relative flex h-10 cursor-pointer items-center justify-between rounded-[5px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent',
        checked ? 'text-accent' : 'text-secondary hover:text-foreground',
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} className="absolute inset-0 z-10 size-full opacity-0" />
      <span className="truncate text-[15px] leading-[40px]">{option.label}</span>
      <span className={cn('text-[15px] leading-[40px]', countBold ? 'font-bold' : 'font-normal')}>
        {option.count}
      </span>
    </label>
  )
}

