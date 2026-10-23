import { useState } from 'react'
import { toast } from 'sonner'
import { profileApi } from '@/lib/api/client'
import { ApiError } from '@/lib/api/http'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { AccountSidebar } from '@/components/layout/AccountSidebar'

export function AccountPage() {
  const { user, token, status, setSession } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPw, setChangingPw] = useState(false)

  if (status === 'guest' || !user || !token) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[560px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <p className="text-lg font-bold text-foreground">Entre para ver seu perfil.</p>
      </div>
    )
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await profileApi.update(token!, { name, bio })
      setSession({ token: token!, user: updated })
      toast.success('Perfil atualizado.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    setChangingPw(true)
    try {
      await profileApi.changePassword(token!, { currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      toast.success('Senha alterada.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erro ao alterar senha.')
    } finally {
      setChangingPw(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6">
      <AccountSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
          <p className="text-sm text-secondary">Gerencie suas informações de conta.</p>
        </div>

        <form onSubmit={saveProfile} className="flex max-w-xl flex-col gap-4 rounded-[15px] border border-border bg-surface-card p-6">
          <h2 className="text-base font-bold text-foreground">Informações pessoais</h2>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">E-mail</Label>
            <Input id="profile-email" value={user.email} disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Nome</Label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-bio">Bio</Label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="rounded-[10px] border border-border bg-surface-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={saving} className="w-fit">
            {saving ? <Spinner /> : 'Salvar alterações'}
          </Button>
        </form>

        <form onSubmit={savePassword} className="flex max-w-xl flex-col gap-4 rounded-[15px] border border-border bg-surface-card p-6">
          <h2 className="text-base font-bold text-foreground">Alterar senha</h2>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pw-current">Senha atual</Label>
            <Input id="pw-current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pw-new">Nova senha</Label>
            <Input id="pw-new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={changingPw} className="w-fit">
            {changingPw ? <Spinner /> : 'Alterar senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}
