/**
 * Deterministic, offline-safe generative artwork.
 *
 * NFTs reference an `imageUrl` that is a self-contained SVG data URI,
 * so the app renders real images with zero network dependency — which
 * keeps Playwright and Lighthouse runs reproducible and fast.
 */

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function hex(hue: number, sat: number, light: number): string {
  const s = sat / 100
  const l = light / 100
  const k = (n: number) => (n + hue / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function makeArtDataUri(seed: string, label: string, size = 600): string {
  const h = hashSeed(seed)
  const hueA = h % 360
  const hueB = (hueA + 60 + ((h >> 4) % 140)) % 360
  const c1 = hex(hueA, 55, 30)
  const c2 = hex(hueB, 60, 52)
  const c3 = hex((hueA + 180) % 360, 45, 18)
  const ring = hex((hueA + 30) % 360, 70, 62)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="g1" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </radialGradient>
    <radialGradient id="g2" cx="75%" cy="80%" r="65%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="${c3}"/>
  <rect width="${size}" height="${size}" fill="url(#g1)"/>
  <rect width="${size}" height="${size}" fill="url(#g2)"/>
  <circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.26}" fill="none" stroke="${ring}" stroke-width="${Math.max(2, size * 0.012)}" opacity="0.9"/>
  <circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.16}" fill="none" stroke="${ring}" stroke-width="${Math.max(1.5, size * 0.008)}" opacity="0.5"/>
  <rect x="${size * 0.22}" y="${size * 0.22}" width="${size * 0.56}" height="${size * 0.56}" rx="${size * 0.12}" fill="none" stroke="${c2}" stroke-width="${Math.max(1, size * 0.004)}" opacity="0.35"/>
  <text x="${size * 0.5}" y="${size * 0.52}" font-family="'Roboto Mono', ui-monospace, monospace" font-size="${size * 0.09}" font-weight="700" fill="#F5F1EB" text-anchor="middle" letter-spacing="0.08em">${escapeXml(label)}</text>
  <text x="${size * 0.5}" y="${size * 0.5 + size * 0.13}" font-family="'Roboto Mono', ui-monospace, monospace" font-size="${size * 0.035}" font-weight="500" fill="#CFB28C" text-anchor="middle" letter-spacing="0.3em">KURIO</text>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
