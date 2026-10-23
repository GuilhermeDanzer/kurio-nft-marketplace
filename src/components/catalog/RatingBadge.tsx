import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingBadge({ rating, count, className }: { rating: number; count: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm text-accent', className)} aria-label={`Avaliação ${rating} de 5`}>
      <Star className="size-3.5 fill-accent" />
      {rating.toFixed(1)}
      <span className="text-secondary">({count})</span>
    </span>
  )
}
