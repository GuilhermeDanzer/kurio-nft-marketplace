import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export function AuthDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  redirectTo,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: 'login' | 'register'
  onModeChange: (m: 'login' | 'register') => void
  redirectTo: string | undefined
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[448px] rounded-[5px] p-0" hideClose>
        <div className="flex flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[32px] font-bold leading-none tracking-[0.1em] text-foreground">KURIO</span>
            <AuthTabs mode={mode} onModeChange={onModeChange} />
            <DialogHeader className="items-center gap-1 pt-2">
              <DialogTitle className="sr-only">{mode === 'login' ? 'Entrar' : 'Criar conta'}</DialogTitle>
              <DialogDescription className="text-center text-sm text-secondary">
                {mode === 'login'
                  ? 'Bem-vindo de volta ao seu acervo digital.'
                  : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {mode === 'login' ? (
            <LoginForm onOpenChange={onOpenChange} redirectTo={redirectTo} />
          ) : (
            <RegisterForm onOpenChange={onOpenChange} />
          )}

          <Divider />

          <div className="flex flex-col gap-4">
            <SocialButton label="Continuar com Google" brand="G" />
            <SocialButton label="Continuar com Facebook" brand="f" />
          </div>

          {mode === 'login' ? (
            <p className="text-center text-sm text-secondary">
              Novo na Kurio?{' '}
              <button className="text-accent hover:underline" onClick={() => onModeChange('register')}>
                Crie uma conta
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-secondary">
              Já tem uma conta?{' '}
              <button className="text-accent hover:underline" onClick={() => onModeChange('login')}>
                Entre
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AuthTabs({
  mode,
  onModeChange,
}: {
  mode: 'login' | 'register'
  onModeChange: (m: 'login' | 'register') => void
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        className={mode === 'login' ? 'font-bold text-foreground' : 'text-secondary'}
        onClick={() => onModeChange('login')}
      >
        Entrar
      </button>
      <span className="text-border">|</span>
      <button
        className={mode === 'register' ? 'font-bold text-accent' : 'text-secondary'}
        onClick={() => onModeChange('register')}
      >
        Criar conta
      </button>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-2 text-xs text-secondary">
      <span className="h-px flex-1 bg-border" />
      Ou continue com
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function SocialButton({ label, brand }: { label: string; brand: string }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center justify-center gap-3 rounded-[5px] border border-border text-sm text-secondary transition-colors hover:bg-surface-raised"
    >
      <span aria-hidden="true" className="text-accent">
        {brand}
      </span>
      {label}
    </button>
  )
}
