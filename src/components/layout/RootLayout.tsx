import { Outlet } from '@tanstack/react-router'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { MobileTabBar } from './MobileTabBar'
import { AuthDialogProvider } from '@/components/auth/auth-dialog-context'
import { Toaster } from '@/components/ui/sonner'
import { useRealtime } from '@/lib/realtime'

export function RootLayout() {
  useRealtime()
  return (
    <AuthDialogProvider>
      <div className="flex min-h-dvh flex-col bg-ink text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <MobileTabBar />
      </div>
      <Toaster />
    </AuthDialogProvider>
  )
}
