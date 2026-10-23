import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth'
import { ApiError } from '@/lib/api/http'

export function LoginForm({
  onOpenChange,
  redirectTo,
}: {
  onOpenChange: (v: boolean) => void
  redirectTo: string | undefined
}) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      await login(email, password)
      onOpenChange(false)
      if (redirectTo) void navigate({ to: redirectTo })
      else toast.success('Bem-vindo de volta!')
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Não foi possível entrar.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Senha</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            onClick={() => setShow((s) => !s)}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="text-sm text-accent hover:underline">
          Esqueceu a senha?
        </button>
      </div>
      <Button type="submit" size="xl" disabled={pending} className="rounded-[10px]">
        {pending ? <Spinner /> : 'Entrar'}
      </Button>
    </form>
  )
}
