import type { Nft } from '@/lib/contracts'
import { cn } from '@/lib/utils'

function editionLabel(nft: Nft): string {
  switch (nft.edition.type) {
    case 'unique':
      return '1/1'
    case 'limited':
      return nft.edition.total ? `1/${nft.edition.total}` : 'Limitada'
    case 'open':
      return 'ABERTA'
  }
}

export function EditionChips({ nft, selected, onSelect }: { nft: Nft; selected?: boolean; onSelect?: () => void }) {
  const label = editionLabel(nft)
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-7 min-w-[42px] items-center justify-center rounded-full border px-3 text-sm transition-colors',
        selected ? 'border-primary text-accent' : 'border-border text-secondary',
        onSelect && 'hover:border-primary/60',
      )}
    >
      {label}
    </button>
  )
}

export function editionTypeLabel(nft: Nft): string {
  return editionLabel(nft)
}
