import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useAuth } from '@/lib/auth'
import { useAuthDialog } from '@/components/auth/auth-dialog-context'
import { cn } from '@/lib/utils'

export function MobileTabBar() {
  const { cart } = useCart()
  const { status } = useAuth()
  const { openLogin } = useAuthDialog()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0

  const accountTo = status === 'authenticated' ? '/account' : '/account'

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[76px] grid-cols-5 items-end border-t border-border bg-surface-card pb-[env(safe-area-inset-bottom)] shadow-tabbar md:hidden"
    >
      <TabLink to="/" active={pathname === '/'} label="Início">
        <Home className="size-5" />
      </TabLink>
      <TabLink to="/" active={false} label="Buscar">
        <Search className="size-5" />
      </TabLink>

      <div className="flex justify-center pb-3">
        <Link
          to="/cart"
          aria-label="Carrinho"
          className="relative flex size-16 -translate-y-4 items-center justify-center rounded-full bg-gradient-fab text-ink shadow-glowing"
        >
          <ShoppingBag className="size-6" />
          {count > 0 && (
            <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>

      <TabLink to="/cart" active={pathname === '/cart'} label="Carrinho">
        <ShoppingBag className="size-5" />
      </TabLink>

      <button
        className="flex h-full flex-col items-center justify-end gap-1 pb-3 text-secondary"
        onClick={() => (status === 'authenticated' ? undefined : openLogin())}
        aria-label={status === 'authenticated' ? 'Conta' : 'Entrar'}
      >
        {status === 'authenticated' ? (
          <Link to={accountTo} className="flex flex-col items-center gap-1">
            <UserRound className="size-5" />
            <span className="text-[10px]">Conta</span>
          </Link>
        ) : (
          <>
            <UserRound className="size-5" />
            <span className="text-[10px]">Entrar</span>
          </>
        )}
      </button>
    </nav>
  )
}

function TabLink({
  to,
  active,
  label,
  children,
}: {
  to: string
  active: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className={cn('flex h-full flex-col items-center justify-end gap-1 pb-3 text-[10px]', active ? 'text-accent' : 'text-secondary')}
    >
      {children}
      <span>{label}</span>
    </Link>
  )
}
