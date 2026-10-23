import type { Facets, FacetOption } from '@/lib/contracts'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface FacetsValue {
  collections: string[]
  networks: string[]
  status: string[]
  priceMin: string
  priceMax: string
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
  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  return (
    <aside className="flex w-full flex-col gap-8" aria-label="Filtros">
      <FacetGroup title="Coleções">
        {facets.collections.map((c) => (
          <FacetCheck
            key={c.id}
            option={c}
            checked={value.collections.includes(c.id)}
            onToggle={() => onChange({ ...value, collections: toggle(value.collections, c.id) })}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Rede">
        {facets.networks.map((n) => (
          <FacetCheck
            key={n.id}
            option={n}
            checked={value.networks.includes(n.id)}
            onToggle={() => onChange({ ...value, networks: toggle(value.networks, n.id) })}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Status">
        {facets.statuses.map((s) => (
          <FacetCheck
            key={s.id}
            option={s}
            checked={value.status.includes(s.id)}
            onToggle={() => onChange({ ...value, status: toggle(value.status, s.id) })}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Preço (ETH)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="decimal"
            aria-label="Preço mínimo"
            placeholder={facets.price.minEth}
            value={value.priceMin}
            onChange={(e) => onChange({ ...value, priceMin: e.target.value })}
            className="h-10"
          />
          <span className="text-secondary">–</span>
          <Input
            type="number"
            inputMode="decimal"
            aria-label="Preço máximo"
            placeholder={facets.price.maxEth}
            value={value.priceMax}
            onChange={(e) => onChange({ ...value, priceMax: e.target.value })}
            className="h-10"
          />
        </div>
      </FacetGroup>
    </aside>
  )
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">{title}</h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

function FacetCheck({
  option,
  checked,
  onToggle,
}: {
  option: FacetOption
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-[5px] px-1 py-1 text-sm transition-colors',
        checked ? 'text-accent' : 'text-secondary hover:text-foreground',
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className="flex-1">{option.label}</span>
      <span className="text-xs text-secondary">{option.count}</span>
    </label>
  )
}
