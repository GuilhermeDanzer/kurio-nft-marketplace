import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} aria-hidden="true" />
}

export function FullPageSpinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-secondary">
      <Spinner className="size-8" />
      <span aria-live="polite">{label}</span>
    </div>
  )
}
