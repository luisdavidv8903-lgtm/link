import { mkdir, writeFile } from 'node:fs/promises'
import { SEO_PAGES, SITE_URL } from '../src/seoContent.js'

const today = new Date().toISOString()
const publicDir = new URL('../public/', import.meta.url)

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const staticUrls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/admin', priority: '0.1', changefreq: 'monthly' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...SEO_PAGES.map(page => ({ loc: page.slug, priority: '0.8', changefreq: 'monthly' }))]
  .map(page => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DeliveryLink Government Contracting Guides</title>
    <link>${SITE_URL}</link>
    <description>Government contracting readiness guides for small businesses.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(today).toUTCString()}</lastBuildDate>
${SEO_PAGES.map(page => `    <item>
      <title>${xmlEscape(page.title)}</title>
      <link>${SITE_URL}${page.slug}</link>
      <guid>${SITE_URL}${page.slug}</guid>
      <description>${xmlEscape(page.metaDescription)}</description>
      <pubDate>${new Date(today).toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`

await mkdir(publicDir, { recursive: true })
await writeFile(new URL('sitemap.xml', publicDir), sitemap)
await writeFile(new URL('robots.txt', publicDir), robots)
await writeFile(new URL('rss.xml', publicDir), rss)

console.log(`Generated sitemap.xml, robots.txt, and rss.xml for ${SEO_PAGES.length} SEO pages.`)
