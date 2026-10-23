import { Link } from '@tanstack/react-router'
import { ShoppingBag, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Explorar', to: '/' },
  { label: 'Coleções', to: '/' },
]

export function SiteHeader() {
  const { status, user } = useAuth()
  const { cart } = useCart()
  const { openLogin } = useAuthDialog()
  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-[0.1em] text-foreground">
            KURIO
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm text-secondary transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            aria-label="Carrinho"
            className="relative flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-card hover:text-foreground"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>

          {status === 'loading' ? (
            <Skeleton className="size-10 rounded-full" />
          ) : status === 'authenticated' && user ? (
            <Link
              to="/account"
              aria-label="Minha conta"
              className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-surface-card"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm text-foreground lg:block">{user.name}</span>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => openLogin()}>
              <UserRound className="size-4" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
