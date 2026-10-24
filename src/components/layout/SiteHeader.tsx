import { useState } from 'react'
import { Link, useNavigate, useRouterState, useSearch } from '@tanstack/react-router'
import { LogIn, Search, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Início', to: '/', hash: undefined },
  { label: 'Mercado', to: '/', hash: 'catalogo' },
  { label: 'Criadores', to: '/', hash: 'criadores' },
  { label: 'Aprenda', to: '/', hash: 'aprenda' },
] as const

export function SiteHeader() {
  const { status, user } = useAuth()
  const { cart } = useCart()
  const { openLogin } = useAuthDialog()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const routeSearch = useSearch({ strict: false }) as { q?: string }
  const [searchOpen, setSearchOpen] = useState(false)

  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0

  function commitSearch(value: string) {
    void navigate({ to: '/', search: (prev) => ({ ...(prev as object), q: value || undefined, page: undefined }) })
  }

  return (
    <header className="mx-auto hidden w-full max-w-[1200px] px-4 pt-6 sm:px-6 lg:block lg:px-0">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex h-[35px] items-center text-[14px] font-bold tracking-[0.1em] text-foreground"
        >
          KURIO
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Navegação principal">
          {navItems.map((item) => {
            const active = pathname === '/' && item.hash === undefined
            return (
              <Link
                key={item.label}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                className={cn(
                  'flex flex-col items-center gap-6 text-[16px] leading-[16px] transition-colors',
                  active ? 'font-bold text-accent' : 'font-normal text-foreground hover:text-accent',
                )}
              >
                {item.label}
                <span className={cn('h-[3px] w-full rounded-full', active ? 'bg-primary' : 'bg-transparent')} />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-7">
          {searchOpen ? (
            <input
              autoFocus
              type="search"
              value={routeSearch.q ?? ''}
              onChange={(e) => commitSearch(e.target.value)}
              onBlur={() => setSearchOpen(false)}
              aria-label="Buscar NFTs"
              placeholder="Buscar..."
              className="h-9 w-[150px] rounded-[6px] border border-border bg-surface-card px-3 text-sm text-foreground placeholder:text-secondary-strong focus:outline-none focus:ring-2 focus:ring-primary sm:w-[220px]"
            />
          ) : (
            <button
              type="button"
              aria-label="Buscar NFTs"
              onClick={() => setSearchOpen(true)}
              className="text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Search className="size-5" />
            </button>
          )}

          <Link
            to="/cart"
            aria-label="Carrinho"
            className="relative text-foreground transition-colors hover:text-accent"
          >
            <ShoppingBag className="size-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-ink bg-primary text-[10px] font-medium leading-none text-ink">
                {count}
              </span>
            )}
          </Link>

          {status === 'loading' ? (
            <Skeleton className="size-8 rounded-full" />
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
            <Button
              onClick={() => openLogin()}
              className="h-[35px] rounded-[6px] px-3 text-[16px] font-medium leading-[20px] text-ink"
            >
              <LogIn className="size-5" />
              Entrar
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-primary opacity-30" />
    </header>
  )
}

