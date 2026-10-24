/**
 * Static, non-dynamic copy for the marketing/home sections of the page.
 * Kept data-driven so the visual components stay pure and testable.
 * Bitmap artwork is procedural (see mocks/art.ts) because the Figma
 * image exports are currently unavailable (API 429 seat upgrade).
 */

export const hero = {
  eyebrow: 'Bem-vindo à Kurio',
  title: ['SEJA DONO DO FUTURO', 'DA ARTE DIGITAL'],
  body: 'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
  cta: 'EXPLORAR',
}

export const heroMobile = {
  eyebrow: 'Bem-vindo à Kurio',
  title: ['SEJA DONO DA', 'CULTURA DIGITAL'],
  body: 'Descubra NFTs selecionados de criadores do mundo todo.',
  cta: 'EXPLORAR',
}

export interface Promo {
  id: string
  title: string[]
  body: string
  cta: string
  imageSeed: string
  imageLabel: string
}

export const promos: Promo[] = [
  {
    id: 'genesis',
    title: ['Lançamentos gênesis', 'de edição limitada'],
    body: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    cta: 'Explorar',
    imageSeed: 'promo-genesis',
    imageLabel: 'GÊNESIS',
  },
  {
    id: 'curated',
    title: ['Arte digital selecionada', 'e muito mais'],
    body: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    cta: 'Explorar',
    imageSeed: 'promo-curated',
    imageLabel: 'ARTE',
  },
]

export const blog = {
  eyebrow: 'Diário da Cunhagem',
  subtitle: 'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
}

export const footerFeatures = [
  { letter: 'D', title: 'Descubra', description: 'Explore NFTs selecionados de criadores verificados.' },
  { letter: 'C', title: 'Colecione', description: 'Tenha propriedade digital rara e verificada.' },
  { letter: 'W', title: 'Wallet', description: 'Conecte sua carteira e negocie com segurança.' },
]

export const newsletter = {
  title: 'Antecipe-se ao próximo lançamento',
  placeholder: 'digite seu e-mail...',
  button: 'Enviar',
  description: 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.',
}

export const brandStrip = {
  tagline: ['Feito para colecionadores,', 'criadores e cultura'],
  email: 'contato@email.com',
  phone: '+55 11 4002 8922',
}

export const footerColumns = [
  {
    title: 'Meu perfil',
    links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
  },
  {
    title: 'Central de ajuda',
    links: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'],
  },
  {
    title: 'Coleções',
    links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
  },
]

export const socialLinks = ['Instagram', 'Twitter', 'Youtube', 'Github', 'Linkedin']

export const walletsChip = 'METAMASK • WALLETCONNECT • COINBASE'

export const copyright = '© 2026 Kurio. Propriedade digital para todos.'
