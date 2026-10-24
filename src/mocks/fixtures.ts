import type { Collection, Network, Nft, User, Wallet } from '@/lib/contracts'
import { makeArtDataUri } from './art'
import { heroArt, nftArtwork04, nftArtwork05 } from '@/lib/assets'

export const networks: Network[] = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
]

export const categories: Array<{ id: string; name: string }> = [
  { id: 'arte-digital', name: 'Arte digital' },
  { id: 'fotografia', name: 'Fotografia' },
  { id: 'musica', name: 'Música' },
  { id: 'arte-3d', name: 'Arte 3D' },
  { id: 'colecionaveis', name: 'Colecionáveis' },
  { id: 'generativa', name: 'Generativa' },
  { id: 'jogos', name: 'Jogos' },
  { id: 'assinaturas', name: 'Assinaturas' },
  { id: 'utilidade', name: 'Utilidade' },
]

export const collectionDefs: Array<{
  id: string
  name: string
  slug: string
  description: string
}> = [
  { id: 'c1', name: 'Kurio Apes', slug: 'kurio-apes', description: 'Primatas digitais raros da rede Ethereum.' },
  { id: 'c2', name: 'Neo Punks', slug: 'neo-punks', description: 'Punks da nova era, curados e verificados.' },
  { id: 'c3', name: 'Ethereal Beings', slug: 'ethereal-beings', description: 'Entidades etéreas geradas por IA.' },
  { id: 'c4', name: 'Chrome District', slug: 'chrome-district', description: 'Máquinas e androides do distrito cromo.' },
  { id: 'c5', name: 'Solar Horses', slug: 'solar-horses', description: 'Corcéis solares em movimento perpétuo.' },
  { id: 'c6', name: 'Dreamscapes', slug: 'dreamscapes', description: 'Paisagens oníricas colecionáveis.' },
  { id: 'c7', name: 'Crypto Cuties', slug: 'crypto-cuties', description: 'Adoráveis criaturas on-chain.' },
  { id: 'c8', name: 'Void Walkers', slug: 'void-walkers', description: 'Andarilhos do vazio entre mundos.' },
  { id: 'c9', name: 'Ancient Relics', slug: 'ancient-relics', description: 'Relíquias ancestrais tokenizadas.' },
]

export const users: User[] = [
  { id: 'u_ana', name: 'Ana Colecionadora', email: 'ana@kurio.test', avatarUrl: null, bio: 'Colecionadora de arte digital desde 2021.' },
  { id: 'u_bruno', name: 'Bruno Trader', email: 'bruno@kurio.test', avatarUrl: null, bio: 'Trader e curador independente.' },
]

export const credentials: Record<string, string> = {
  u_ana: 'senha123',
  u_bruno: 'senha123',
}

export const walletsByUser: Record<string, Wallet[]> = {
  u_ana: [
    { id: 'w_ana_1', type: 'metamask', address: '0xA91F3b6C4E82d8a5B7c9D1e0F2a3B4c5D6e7F8', networkId: 'ethereum', isDefault: true },
    { id: 'w_ana_2', type: 'coinbase', address: '0x8b2C1d4E6f9A0b3c5D7e8F1a2B3c4d5E6f7a8b9', networkId: 'polygon', isDefault: false },
  ],
  u_bruno: [
    { id: 'w_bruno_1', type: 'metamask', address: '0x3f7B9c1D2e4A6b8F0a1C3d5E7f9B2a4c6D8e0f1', networkId: 'ethereum', isDefault: true },
  ],
}

interface NftSeed {
  id: string
  tokenId: string
  name: string
  collectionId: string
  categoryId: string
  networkId: Network['id']
  status: Nft['status']
  edition: Nft['edition']
  priceEth: string
  attributes: string[]
  rating: number
  ratingCount: number
  daysAgo: number
}

const nftSeeds: NftSeed[] = [
  { id: 'n01', tokenId: '#0042', name: 'Emerald Ape #042', collectionId: 'c1', categoryId: 'arte-digital', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 1 }, priceEth: '1.19', attributes: ['Óculos', 'Esmeralda', 'Raro'], rating: 4.8, ratingCount: 19, daysAgo: 1 },
  { id: 'n02', tokenId: '#0137', name: 'Golden Ape #137', collectionId: 'c1', categoryId: 'colecionaveis', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 5 }, priceEth: '2.45', attributes: ['Coroa', 'Ouro', 'Lendário'], rating: 4.9, ratingCount: 33, daysAgo: 2 },
  { id: 'n03', tokenId: '#0201', name: 'Cyber Ape #201', collectionId: 'c1', categoryId: 'arte-digital', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.58', attributes: ['Neon', 'Óculos'], rating: 4.3, ratingCount: 11, daysAgo: 3 },
  { id: 'n04', tokenId: '#0098', name: 'Pixel Punk #098', collectionId: 'c2', categoryId: 'colecionaveis', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '5.02', attributes: ['Pixel', 'Único'], rating: 5.0, ratingCount: 41, daysAgo: 1 },
  { id: 'n05', tokenId: '#0074', name: 'Neon Punk #074', collectionId: 'c2', categoryId: 'arte-digital', networkId: 'solana', status: 'available', edition: { type: 'limited', total: 50, number: 12 }, priceEth: '0.92', attributes: ['Neon', 'Moicano'], rating: 4.1, ratingCount: 8, daysAgo: 5 },
  { id: 'n06', tokenId: '#0033', name: 'Ghost Punk #033', collectionId: 'c2', categoryId: 'colecionaveis', networkId: 'ethereum', status: 'sold', edition: { type: 'limited', total: 50, number: 33 }, priceEth: '1.4', attributes: ['Fantasma', 'Raro'], rating: 4.6, ratingCount: 27, daysAgo: 12 },
  { id: 'n07', tokenId: '#0512', name: 'Seraph #512', collectionId: 'c3', categoryId: 'generativa', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 2 }, priceEth: '3.7', attributes: ['Asas', 'Luz'], rating: 4.9, ratingCount: 52, daysAgo: 1 },
  { id: 'n08', tokenId: '#0307', name: 'Wisp #307', collectionId: 'c3', categoryId: 'musica', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.44', attributes: ['Espectral', 'Azul'], rating: 4.0, ratingCount: 6, daysAgo: 7 },
  { id: 'n09', tokenId: '#0455', name: 'Titan #455', collectionId: 'c4', categoryId: 'arte-3d', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '8.99', attributes: ['Cromo', 'Gigante'], rating: 4.8, ratingCount: 22, daysAgo: 2 },
  { id: 'n10', tokenId: '#0220', name: 'Drone #220', collectionId: 'c4', categoryId: 'arte-3d', networkId: 'solana', status: 'available', edition: { type: 'limited', total: 50, number: 20 }, priceEth: '1.12', attributes: ['Voo', 'Metal'], rating: 4.2, ratingCount: 14, daysAgo: 4 },
  { id: 'n11', tokenId: '#0114', name: 'Pegasus #114', collectionId: 'c5', categoryId: 'fotografia', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 4 }, priceEth: '2.88', attributes: ['Asas', 'Solar'], rating: 4.7, ratingCount: 18, daysAgo: 3 },
  { id: 'n12', tokenId: '#0031', name: 'Stallion #031', collectionId: 'c5', categoryId: 'fotografia', networkId: 'polygon', status: 'sold', edition: { type: 'open', total: null, number: null }, priceEth: '0.65', attributes: ['Fogo', 'Crina'], rating: 4.4, ratingCount: 9, daysAgo: 15 },
  { id: 'n13', tokenId: '#0880', name: 'Aurora Field', collectionId: 'c6', categoryId: 'arte-digital', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '4.15', attributes: ['Aurora', 'Paisagem'], rating: 5.0, ratingCount: 38, daysAgo: 1 },
  { id: 'n14', tokenId: '#0611', name: 'Nebula Lake', collectionId: 'c6', categoryId: 'arte-digital', networkId: 'solana', status: 'available', edition: { type: 'limited', total: 10, number: 7 }, priceEth: '1.66', attributes: ['Névoa', 'Lago'], rating: 4.5, ratingCount: 12, daysAgo: 6 },
  { id: 'n15', tokenId: '#0402', name: 'Kitty #402', collectionId: 'c7', categoryId: 'jogos', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.33', attributes: ['Fofo', 'Rosa'], rating: 4.6, ratingCount: 25, daysAgo: 2 },
  { id: 'n16', tokenId: '#0418', name: 'Puppy #418', collectionId: 'c7', categoryId: 'jogos', networkId: 'ethereum', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.41', attributes: ['Fofo', 'Dourado'], rating: 4.7, ratingCount: 30, daysAgo: 1 },
  { id: 'n17', tokenId: '#0701', name: 'Abyss Walker #701', collectionId: 'c8', categoryId: 'generativa', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 3 }, priceEth: '2.1', attributes: ['Sombra', 'Véu'], rating: 4.8, ratingCount: 16, daysAgo: 3 },
  { id: 'n18', tokenId: '#0712', name: 'Void Shade #712', collectionId: 'c8', categoryId: 'generativa', networkId: 'solana', status: 'available', edition: { type: 'limited', total: 50, number: 28 }, priceEth: '0.87', attributes: ['Trevas', 'Névoa'], rating: 4.1, ratingCount: 7, daysAgo: 8 },
  { id: 'n19', tokenId: '#0909', name: 'Relic of Dawn', collectionId: 'c9', categoryId: 'utilidade', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '6.5', attributes: ['Sagrado', 'Ouro'], rating: 4.9, ratingCount: 44, daysAgo: 2 },
  { id: 'n20', tokenId: '#0915', name: 'Amber Sigil', collectionId: 'c9', categoryId: 'utilidade', networkId: 'polygon', status: 'available', edition: { type: 'limited', total: 10, number: 6 }, priceEth: '1.93', attributes: ['Âmbar', 'Selo'], rating: 4.4, ratingCount: 13, daysAgo: 5 },
  { id: 'n21', tokenId: '#0125', name: 'Sapphire Ape #125', collectionId: 'c1', categoryId: 'colecionaveis', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 8 }, priceEth: '2.02', attributes: ['Safira', 'Coroa'], rating: 4.7, ratingCount: 21, daysAgo: 4 },
  { id: 'n22', tokenId: '#0350', name: 'Oracle #350', collectionId: 'c3', categoryId: 'assinaturas', networkId: 'solana', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '3.34', attributes: ['Olho', 'Profecia'], rating: 4.8, ratingCount: 29, daysAgo: 2 },
  { id: 'n23', tokenId: '#0260', name: 'Sentinel #260', collectionId: 'c4', categoryId: 'arte-3d', networkId: 'polygon', status: 'available', edition: { type: 'limited', total: 50, number: 41 }, priceEth: '0.74', attributes: ['Guardião', 'Aço'], rating: 4.0, ratingCount: 5, daysAgo: 9 },
  { id: 'n24', tokenId: '#0180', name: 'Comet #180', collectionId: 'c5', categoryId: 'fotografia', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 9 }, priceEth: '2.3', attributes: ['Cometa', 'Cauda'], rating: 4.5, ratingCount: 17, daysAgo: 3 },
]

const nftDescription = 'Obra digital verificada e registrada na blockchain. A propriedade é transferida de forma segura e imutável após a confirmação da transação.'

/**
 * Curated Figma artwork per catalog item. The mapping interleaves the three
 * available images so the default "recent" sort shows them in a repeating
 * 05 / 04 / hero order instead of clustering identical artwork together.
 */
const nftArtBySeedId: Record<string, string> = {
  n01: nftArtwork05,
  n02: heroArt,
  n03: nftArtwork04,
  n04: nftArtwork04,
  n05: nftArtwork04,
  n06: nftArtwork04,
  n07: heroArt,
  n08: nftArtwork04,
  n09: nftArtwork05,
  n10: heroArt,
  n11: heroArt,
  n12: heroArt,
  n13: nftArtwork05,
  n14: nftArtwork05,
  n15: nftArtwork04,
  n16: nftArtwork04,
  n17: nftArtwork05,
  n18: heroArt,
  n19: heroArt,
  n20: heroArt,
  n21: nftArtwork05,
  n22: nftArtwork05,
  n23: nftArtwork05,
  n24: nftArtwork04,
}

function nftImageFor(id: string): string {
  return nftArtBySeedId[id] ?? nftArtwork05
}

export function seedCollections(): Collection[] {
  return collectionDefs.map((c) => {
    const items = nftSeeds.filter((n) => n.collectionId === c.id)
    const floor = items.length
      ? items.reduce((min, n) => (Number(n.priceEth) < Number(min.priceEth) ? n : min), items[0]!).priceEth
      : '0'
    return {
      ...c,
      imageUrl: makeArtDataUri(c.slug, c.name.replace(/ /g, '').toUpperCase().slice(0, 6), 300),
      itemCount: items.length,
      floorEth: floor,
    }
  })
}

export function seedNfts(): Nft[] {
  // Fixed reference timestamp so `createdAt` (and therefore the default
  // "recent" sort order) is deterministic across runs — `Date.now()` was
  // causing millisecond-resolution ties that shifted card order under load.
  const referenceMs = Date.parse('2026-01-01T00:00:00.000Z')
  return nftSeeds.map((s) => ({
    id: s.id,
    tokenId: s.tokenId,
    name: s.name,
    collectionId: s.collectionId,
    categoryId: s.categoryId,
    networkId: s.networkId,
    status: s.status,
    edition: s.edition,
    priceEth: s.priceEth,
    imageUrl: nftImageFor(s.id),
    attributes: s.attributes,
    description: nftDescription,
    rating: s.rating,
    ratingCount: s.ratingCount,
    createdAt: new Date(referenceMs - s.daysAgo * 86400_000).toISOString(),
  }))
}

export interface BlogPost {
  id: string
  meta: string
  title: string
  description: string
  imageUrl: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    meta: '12 de setembro | Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    imageUrl: makeArtDataUri('blog-1', 'COMO', 500),
  },
  {
    id: 'blog-2',
    meta: '13 de setembro | Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
    imageUrl: makeArtDataUri('blog-2', '10', 500),
  },
  {
    id: 'blog-3',
    meta: '15 de setembro | Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    imageUrl: makeArtDataUri('blog-3', 'RARO', 500),
  },
  {
    id: 'blog-4',
    meta: '15 de setembro | Leitura de 2 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    imageUrl: makeArtDataUri('blog-4', 'SEG', 500),
  },
]


