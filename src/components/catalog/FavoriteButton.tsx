import { Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useFavorites, useToggleFavorite } from '@/lib/favorites'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'
import { cn } from '@/lib/utils'

export function FavoriteButton({ nftId, className }: { nftId: string; className?: string }) {
  const { status } = useAuth()
  const { openLogin } = useAuthDialog()
  const { data: favorites } = useFavorites()
  const toggle = useToggleFavorite()
  const isFavorite = favorites?.includes(nftId) ?? false

  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'authenticated') {
      openLogin()
      return
    }
    toggle.mutate({ nftId, isFavorite })
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFavorite}
      onClick={onClick}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-border bg-surface-raised/80 text-secondary backdrop-blur transition-colors hover:text-accent',
        isFavorite && 'text-accent',
        className,
      )}
    >
      <Heart className={cn('size-4', isFavorite && 'fill-accent')} />
    </button>
  )
}
