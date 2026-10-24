/**
 * Curated bitmap artwork exported from the Figma file.
 * Replaces the procedural SVG placeholders for the hero and the first
 * catalog cards. Additional card artwork can be dropped into `src/assets`
 * and mapped here (or in `mocks/fixtures.ts`).
 */
import heroArt from '@/assets/hero-art.png'
import nftArtwork04 from '@/assets/nft-artwork-04.png'
import nftArtwork05 from '@/assets/nft-artwork-05.png'

/**
 * Figma bitmap artwork reused across the catalog. The design reuses the same
 * few images (the hero art appears both in the hero and on catalog cards), so
 * we cycle this pool over the mock items instead of the procedural placeholders.
 */
export const nftArtPool = [nftArtwork05, nftArtwork04, heroArt]

export { heroArt, nftArtwork04, nftArtwork05 }
