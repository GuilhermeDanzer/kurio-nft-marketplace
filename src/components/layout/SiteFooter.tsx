import { Link } from '@tanstack/react-router'

const linkColumns = [
  {
    title: 'Mercado',
    links: [
      { label: 'Explorar NFTs', to: '/' },
      { label: 'Coleções', to: '/' },
      { label: 'Carrinho', to: '/cart' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { label: 'Meu perfil', to: '/account' },
      { label: 'Carteiras', to: '/account/wallets' },
      { label: 'Favoritos', to: '/' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', to: '/' },
      { label: 'Termos de uso', to: '/' },
      { label: 'Privacidade', to: '/' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface-card pb-28 md:pb-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold tracking-[0.1em] text-foreground">KURIO</span>
          <p className="max-w-xs text-sm leading-6 text-secondary">
            O marketplace curado de arte digital. Descubra, colecione e negocie NFTs com segurança.
          </p>
        </div>
        {linkColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <span className="text-sm font-bold text-foreground">{col.title}</span>
            {col.links.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm text-secondary transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-6 sm:px-6">
        <p className="text-xs text-secondary">© 2026 KURIO. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
