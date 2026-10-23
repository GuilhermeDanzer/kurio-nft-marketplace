import type { Collection, Network, Nft, User, Wallet } from '@/lib/contracts'
import { makeArtDataUri } from './art'

export const networks: Network[] = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH' },
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
  { id: 'n01', tokenId: '#0042', name: 'Emerald Ape #042', collectionId: 'c1', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 1 }, priceEth: '1.19', attributes: ['Óculos', 'Esmeralda', 'Raro'], rating: 4.8, ratingCount: 19, daysAgo: 1 },
  { id: 'n02', tokenId: '#0137', name: 'Golden Ape #137', collectionId: 'c1', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 5 }, priceEth: '2.45', attributes: ['Coroa', 'Ouro', 'Lendário'], rating: 4.9, ratingCount: 33, daysAgo: 2 },
  { id: 'n03', tokenId: '#0201', name: 'Cyber Ape #201', collectionId: 'c1', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.58', attributes: ['Neon', 'Óculos'], rating: 4.3, ratingCount: 11, daysAgo: 3 },
  { id: 'n04', tokenId: '#0098', name: 'Pixel Punk #098', collectionId: 'c2', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '5.02', attributes: ['Pixel', 'Único'], rating: 5.0, ratingCount: 41, daysAgo: 1 },
  { id: 'n05', tokenId: '#0074', name: 'Neon Punk #074', collectionId: 'c2', networkId: 'arbitrum', status: 'available', edition: { type: 'limited', total: 50, number: 12 }, priceEth: '0.92', attributes: ['Neon', 'Moicano'], rating: 4.1, ratingCount: 8, daysAgo: 5 },
  { id: 'n06', tokenId: '#0033', name: 'Ghost Punk #033', collectionId: 'c2', networkId: 'ethereum', status: 'sold', edition: { type: 'limited', total: 50, number: 33 }, priceEth: '1.4', attributes: ['Fantasma', 'Raro'], rating: 4.6, ratingCount: 27, daysAgo: 12 },
  { id: 'n07', tokenId: '#0512', name: 'Seraph #512', collectionId: 'c3', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 2 }, priceEth: '3.7', attributes: ['Asas', 'Luz'], rating: 4.9, ratingCount: 52, daysAgo: 1 },
  { id: 'n08', tokenId: '#0307', name: 'Wisp #307', collectionId: 'c3', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.44', attributes: ['Espectral', 'Azul'], rating: 4.0, ratingCount: 6, daysAgo: 7 },
  { id: 'n09', tokenId: '#0455', name: 'Titan #455', collectionId: 'c4', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '8.99', attributes: ['Cromo', 'Gigante'], rating: 4.8, ratingCount: 22, daysAgo: 2 },
  { id: 'n10', tokenId: '#0220', name: 'Drone #220', collectionId: 'c4', networkId: 'arbitrum', status: 'available', edition: { type: 'limited', total: 50, number: 20 }, priceEth: '1.12', attributes: ['Voo', 'Metal'], rating: 4.2, ratingCount: 14, daysAgo: 4 },
  { id: 'n11', tokenId: '#0114', name: 'Pegasus #114', collectionId: 'c5', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 4 }, priceEth: '2.88', attributes: ['Asas', 'Solar'], rating: 4.7, ratingCount: 18, daysAgo: 3 },
  { id: 'n12', tokenId: '#0031', name: 'Stallion #031', collectionId: 'c5', networkId: 'polygon', status: 'sold', edition: { type: 'open', total: null, number: null }, priceEth: '0.65', attributes: ['Fogo', 'Crina'], rating: 4.4, ratingCount: 9, daysAgo: 15 },
  { id: 'n13', tokenId: '#0880', name: 'Aurora Field', collectionId: 'c6', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '4.15', attributes: ['Aurora', 'Paisagem'], rating: 5.0, ratingCount: 38, daysAgo: 1 },
  { id: 'n14', tokenId: '#0611', name: 'Nebula Lake', collectionId: 'c6', networkId: 'arbitrum', status: 'available', edition: { type: 'limited', total: 10, number: 7 }, priceEth: '1.66', attributes: ['Névoa', 'Lago'], rating: 4.5, ratingCount: 12, daysAgo: 6 },
  { id: 'n15', tokenId: '#0402', name: 'Kitty #402', collectionId: 'c7', networkId: 'polygon', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.33', attributes: ['Fofo', 'Rosa'], rating: 4.6, ratingCount: 25, daysAgo: 2 },
  { id: 'n16', tokenId: '#0418', name: 'Puppy #418', collectionId: 'c7', networkId: 'ethereum', status: 'available', edition: { type: 'open', total: null, number: null }, priceEth: '0.41', attributes: ['Fofo', 'Dourado'], rating: 4.7, ratingCount: 30, daysAgo: 1 },
  { id: 'n17', tokenId: '#0701', name: 'Abyss Walker #701', collectionId: 'c8', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 3 }, priceEth: '2.1', attributes: ['Sombra', 'Véu'], rating: 4.8, ratingCount: 16, daysAgo: 3 },
  { id: 'n18', tokenId: '#0712', name: 'Void Shade #712', collectionId: 'c8', networkId: 'arbitrum', status: 'available', edition: { type: 'limited', total: 50, number: 28 }, priceEth: '0.87', attributes: ['Trevas', 'Névoa'], rating: 4.1, ratingCount: 7, daysAgo: 8 },
  { id: 'n19', tokenId: '#0909', name: 'Relic of Dawn', collectionId: 'c9', networkId: 'ethereum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '6.5', attributes: ['Sagrado', 'Ouro'], rating: 4.9, ratingCount: 44, daysAgo: 2 },
  { id: 'n20', tokenId: '#0915', name: 'Amber Sigil', collectionId: 'c9', networkId: 'polygon', status: 'available', edition: { type: 'limited', total: 10, number: 6 }, priceEth: '1.93', attributes: ['Âmbar', 'Selo'], rating: 4.4, ratingCount: 13, daysAgo: 5 },
  { id: 'n21', tokenId: '#0125', name: 'Sapphire Ape #125', collectionId: 'c1', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 8 }, priceEth: '2.02', attributes: ['Safira', 'Coroa'], rating: 4.7, ratingCount: 21, daysAgo: 4 },
  { id: 'n22', tokenId: '#0350', name: 'Oracle #350', collectionId: 'c3', networkId: 'arbitrum', status: 'available', edition: { type: 'unique', total: 1, number: 1 }, priceEth: '3.34', attributes: ['Olho', 'Profecia'], rating: 4.8, ratingCount: 29, daysAgo: 2 },
  { id: 'n23', tokenId: '#0260', name: 'Sentinel #260', collectionId: 'c4', networkId: 'polygon', status: 'available', edition: { type: 'limited', total: 50, number: 41 }, priceEth: '0.74', attributes: ['Guardião', 'Aço'], rating: 4.0, ratingCount: 5, daysAgo: 9 },
  { id: 'n24', tokenId: '#0180', name: 'Comet #180', collectionId: 'c5', networkId: 'ethereum', status: 'available', edition: { type: 'limited', total: 10, number: 9 }, priceEth: '2.3', attributes: ['Cometa', 'Cauda'], rating: 4.5, ratingCount: 17, daysAgo: 3 },
]

const nftDescription = 'Obra digital verificada e registrada na blockchain. A propriedade é transferida de forma segura e imutável após a confirmação da transação.'

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
  return nftSeeds.map((s) => ({
    id: s.id,
    tokenId: s.tokenId,
    name: s.name,
    collectionId: s.collectionId,
    networkId: s.networkId,
    status: s.status,
    edition: s.edition,
    priceEth: s.priceEth,
    imageUrl: makeArtDataUri(s.id, s.tokenId, 600),
    attributes: s.attributes,
    description: nftDescription,
    rating: s.rating,
    ratingCount: s.ratingCount,
    createdAt: new Date(Date.now() - s.daysAgo * 86400_000).toISOString(),
  }))
}


