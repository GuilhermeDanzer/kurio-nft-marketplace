import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth'
import { ApiError } from '@/lib/api/http'

export function RegisterForm({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('As senhas não coincidem.')
      return
    }
    setPending(true)
    try {
      await register(name, email, password)
      onOpenChange(false)
      toast.success('Conta criada!')
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message)
      else toast.error('Não foi possível criar a conta.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-name">Nome de usuário</Label>
        <Input
          id="reg-name"
          autoComplete="username"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-email">E-mail</Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-password">Senha</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-confirm">Confirmar senha</Label>
        <Input
          id="reg-confirm"
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="**********"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <Button type="submit" size="xl" disabled={pending} className="rounded-[10px]">
        {pending ? <Spinner /> : 'Criar conta'}
      </Button>
    </form>
  )
}
