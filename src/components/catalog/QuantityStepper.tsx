import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 5,
  size = 'md',
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}) {
  const btn = cn(
    'flex items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary hover:text-accent disabled:opacity-40',
    size === 'md' ? 'size-9' : 'size-7',
  )

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Quantidade">
      <button type="button" aria-label="Diminuir" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-6 text-center text-lg font-medium text-foreground" aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label="Aumentar" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
