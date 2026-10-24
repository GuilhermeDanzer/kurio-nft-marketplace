import { cn } from '@/lib/utils'

export interface PriceRangeSliderProps {
  min: number
  max: number
  low: number
  high: number
  onChange: (low: number, high: number) => void
  className?: string
}

/**
 * Dual-thumb range slider. Two native <input type="range"> controls are
 * stacked; their tracks are pointer-transparent so only the thumbs grab
 * events, while the shared track/fill is drawn underneath. Keyboard
 * navigation is preserved by keeping both inputs focusable.
 */
export function PriceRangeSlider({ min, max, low, high, onChange, className }: PriceRangeSliderProps) {
  const span = Math.max(max - min, 0.0001)
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const lowPct = ((clamp(Math.min(low, high)) - min) / span) * 100
  const highPct = ((clamp(Math.max(low, high)) - min) / span) * 100

  return (
    <div className={cn('relative h-[15px] w-full', className)}>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary/40" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={clamp(low)}
        onChange={(e) => onChange(Number(e.target.value), Math.max(high, Number(e.target.value)))}
        aria-label="Preço mínimo"
        className="dual-range"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={clamp(high)}
        onChange={(e) => onChange(Math.min(low, Number(e.target.value)), Number(e.target.value))}
        aria-label="Preço máximo"
        className="dual-range"
      />
    </div>
  )
}
