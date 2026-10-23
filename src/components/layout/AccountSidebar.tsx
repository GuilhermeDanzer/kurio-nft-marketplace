import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, UserRound, Wallet } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function AccountSidebar() {
  const { user, logout } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const items = [
    { label: 'Perfil', to: '/account', icon: UserRound },
    { label: 'Carteiras', to: '/account/wallets', icon: Wallet },
  ]

  return (
    <aside className="hidden w-[310px] shrink-0 flex-col gap-6 md:flex">
      <div className="flex items-center gap-3 rounded-[15px] border border-border bg-surface-card p-5">
        <Avatar className="size-12">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ''} />
          <AvatarFallback>{user?.name.charAt(0).toUpperCase() ?? '?'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{user?.name}</p>
          <p className="truncate text-xs text-secondary">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm transition-colors',
                active ? 'bg-surface-raised text-accent' : 'text-secondary hover:bg-surface-card hover:text-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Button variant="ghost" className="justify-start gap-3 px-4" onClick={() => void logout()}>
        <LogOut className="size-4" />
        Sair
      </Button>
    </aside>
  )
}
