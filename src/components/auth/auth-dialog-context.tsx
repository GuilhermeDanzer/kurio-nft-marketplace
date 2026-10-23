import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AuthDialog } from './AuthDialog'

interface AuthDialogValue {
  openLogin: (redirectTo?: string) => void
  openRegister: (redirectTo?: string) => void
}

const AuthDialogContext = createContext<AuthDialogValue | null>(null)

export function useAuthDialog(): AuthDialogValue {
  const ctx = useContext(AuthDialogContext)
  if (!ctx) throw new Error('useAuthDialog must be used within AuthDialogProvider')
  return ctx
}

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined)

  const openLogin = useCallback((redirect?: string) => {
    setMode('login')
    setRedirectTo(redirect)
    setOpen(true)
  }, [])

  const openRegister = useCallback((redirect?: string) => {
    setMode('register')
    setRedirectTo(redirect)
    setOpen(true)
  }, [])

  return (
    <AuthDialogContext.Provider value={{ openLogin, openRegister }}>
      {children}
      <AuthDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        onModeChange={setMode}
        redirectTo={redirectTo}
      />
    </AuthDialogContext.Provider>
  )
}
