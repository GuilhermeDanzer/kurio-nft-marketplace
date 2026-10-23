import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@/lib/contracts'
import { authApi } from '@/lib/api/client'
import { ApiError } from '@/lib/api/http'
import { queryClient } from './query'
import { uid } from './id'

const TOKEN_KEY = 'kurio:token'
const GUEST_KEY = 'kurio:guest'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

interface AuthContextValue {
  token: string | null
  user: User | null
  guestKey: string
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setSession: (session: Session) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readGuestKey(): string {
  let key = localStorage.getItem(GUEST_KEY)
  if (!key) {
    key = uid('guest')
    localStorage.setItem(GUEST_KEY, key)
  }
  return key
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => (localStorage.getItem(TOKEN_KEY) ? 'loading' : 'guest'))
  const guestKey = useMemo(() => readGuestKey(), [])

  const setSession = useCallback((session: Session) => {
    localStorage.setItem(TOKEN_KEY, session.token)
    setToken(session.token)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setStatus('guest')
    // Purge all authenticated cache on logout / user switch.
    queryClient.clear()
  }, [])

  // Session recovery + expiry handling on boot.
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) return
    let cancelled = false
    authApi
      .me(stored)
      .then((session) => {
        if (cancelled) return
        setSession(session)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        if (e instanceof ApiError && e.code === 'UNAUTHORIZED') clearSession()
        else {
          setStatus('guest')
        }
      })
    return () => {
      cancelled = true
    }
  }, [clearSession, setSession])

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login({ email, password })
      setSession(session)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    [setSession],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const session = await authApi.register({ name, email, password })
      setSession(session)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    [setSession],
  )

  const logout = useCallback(async () => {
    if (token) await authApi.logout(token).catch(() => undefined)
    clearSession()
  }, [token, clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, guestKey, status, login, register, logout, setSession }),
    [token, user, guestKey, status, login, register, logout, setSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
