import { Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { brandStrip, copyright, footerColumns, footerFeatures, newsletter, walletsChip } from '@/content/home'

const socialIcons = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Twitter', Icon: Twitter },
  { label: 'Youtube', Icon: Youtube },
  { label: 'Github', Icon: Github },
  { label: 'Linkedin', Icon: Linkedin },
]

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 hidden w-full max-w-[1200px] px-4 sm:px-6 lg:block lg:px-0">
      {/* Band A — features + newsletter */}
      <div className="flex min-h-[250px] flex-wrap items-end justify-between gap-x-8 gap-y-6 rounded-[8px] bg-surface-card px-8 py-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-6">
          {footerFeatures.map((f, i) => (
            <div key={f.letter} className="flex min-w-0 items-center gap-4">
              {i > 0 && <span className="hidden h-[74px] w-px shrink-0 bg-primary sm:block" />}
              <span className="flex size-[74px] shrink-0 items-center justify-center rounded-full bg-primary text-[24px] font-bold leading-none text-ink">
                {f.letter}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[17px] font-bold leading-[24px] text-foreground">{f.title}</span>
                <span className="text-[14px] leading-[22px] text-secondary">{f.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-[357px] shrink-0 flex-col gap-3">
          <span className="text-[18px] font-bold leading-[16px] text-foreground">{newsletter.title}</span>
          <div className="flex h-10">
            <input
              type="email"
              aria-label="E-mail para novidades"
              placeholder={newsletter.placeholder}
              className="h-full flex-1 rounded-l-[6px] border-0 bg-surface-dark px-4 text-[14px] leading-[16px] text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="h-full rounded-r-[6px] bg-primary px-7 text-[18px] font-bold leading-[16px] text-ink transition-colors hover:brightness-110"
            >
              {newsletter.button}
            </button>
          </div>
          <p className="text-[13px] leading-[22px] text-secondary">{newsletter.description}</p>
        </div>
      </div>

      {/* Band B — brand strip */}
      <div className="mt-6 flex min-h-[88px] flex-wrap items-center justify-between gap-x-[92px] gap-y-2 rounded-[8px] bg-surface-dark px-8 py-4">
        <span className="text-[14px] font-bold leading-none tracking-[0.1em] text-foreground">KURIO</span>
        <span className="text-[14px] leading-[22px] text-secondary">
          {brandStrip.tagline[0]}
          <br />
          {brandStrip.tagline[1]}
        </span>
        <span className="text-[14px] leading-[22px] text-secondary">{brandStrip.email}</span>
        <span className="text-[14px] leading-[22px] text-secondary">{brandStrip.phone}</span>
      </div>

      {/* Band C — link columns + social + wallets */}
      <div className="mt-6 flex min-h-[236px] flex-wrap justify-between gap-x-8 gap-y-6 rounded-[8px] bg-surface-card px-8 py-8">
        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <span className="text-[16px] font-bold leading-[20px] text-foreground">{col.title}</span>
            <div className="flex flex-col">
              {col.links.map((link) => (
                <a key={link} href="#catalogo" className="text-[14px] leading-[30px] text-secondary transition-colors hover:text-foreground">
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-6">
          <span className="text-[16px] font-bold leading-[20px] text-foreground">Redes sociais</span>
          <div className="flex gap-3">
            {socialIcons.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex size-[30px] items-center justify-center rounded-[4px] border border-primary text-foreground transition-colors hover:bg-surface-dark"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <span className="text-[16px] font-bold leading-[20px] text-foreground">Carteiras compatíveis</span>
          <span className="text-[9px] font-bold leading-none tracking-[0.1em] text-accent">{walletsChip}</span>
        </div>
      </div>

      {/* Band D — copyright */}
      <div className="flex items-center justify-between px-8 py-6">
        <p className="text-[14px] leading-[30px] text-secondary">{copyright}</p>
        <span className="text-[14px] font-bold leading-none tracking-[0.1em] text-foreground">KURIO</span>
      </div>
    </footer>
  )
}

