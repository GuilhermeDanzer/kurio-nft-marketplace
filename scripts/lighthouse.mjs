import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const PORT = 9222
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(process.cwd(), 'reports', 'lighthouse')
const PAGES = ['/', '/nft/n01']
const PROFILES = ['mobile', 'desktop']
const RUNS = 3

mkdirSync(OUT, { recursive: true })

function median(arr) {
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

function runLighthouse(url, profile) {
  const desktop = profile === 'desktop'
  return lighthouse(
    url,
    {
      port: PORT,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: desktop ? 'desktop' : 'mobile',
      screenEmulation: desktop
        ? { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }
        : { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
      throttling: desktop
        ? { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 }
        : undefined,
    },
    {
      extends: 'lighthouse:default',
      settings: { formFactor: desktop ? 'desktop' : 'mobile' },
    },
  )
}

function extract(lhr) {
  const cat = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100)
  return {
    performance: cat('performance'),
    accessibility: cat('accessibility'),
    bestPractices: cat('best-practices'),
    seo: cat('seo'),
    lcp: Math.round(lhr.audits['largest-contentful-paint']?.numericValue ?? 0),
    cls: Number((lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(4)),
    tbt: Math.round(lhr.audits['total-blocking-time']?.numericValue ?? 0),
  }
}

const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'], port: PORT })

const summary = {}
const rows = []

for (const profile of PROFILES) {
  for (const page of PAGES) {
    const key = `${profile}:${page}`
    const runs = []
    for (let i = 0; i < RUNS; i++) {
      const { lhr } = await runLighthouse(`http://127.0.0.1:4173${page}`, profile)
      runs.push(extract(lhr))
      console.log(`  ${key} run ${i + 1}: perf=${runs[i].performance} a11y=${runs[i].accessibility} seo=${runs[i].seo} bp=${runs[i].bestPractices} LCP=${runs[i].lcp}ms CLS=${runs[i].cls} TBT=${runs[i].tbt}ms`)
    }
    const med = {
      page,
      profile,
      performance: median(runs.map((r) => r.performance)),
      accessibility: median(runs.map((r) => r.accessibility)),
      bestPractices: median(runs.map((r) => r.bestPractices)),
      seo: median(runs.map((r) => r.seo)),
      lcp: median(runs.map((r) => r.lcp)),
      cls: median(runs.map((r) => r.cls)),
      tbt: median(runs.map((r) => r.tbt)),
      runs,
    }
    summary[key] = med
    rows.push(med)
  }
}

await chrome.kill()

writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2))

const md = [
  '# Lighthouse — medianas (3 execuções)',
  '',
  '| Perfil | Página | Performance | A11y | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(
    (r) =>
      `| ${r.profile} | \`${r.page}\` | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} |`,
  ),
  '',
].join('\n')

writeFileSync(join(OUT, 'summary.md'), md)
console.log('\nMedians written to reports/lighthouse/summary.json + summary.md')
console.log(md)
