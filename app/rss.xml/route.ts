import { siteConfig } from "@/lib/site-config"
import { getColumns } from "@/lib/content"

/** 칼럼 RSS (네이버 서치어드바이저 'RSS 제출'용). /rss.xml */
export const revalidate = 3600

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function GET() {
  const base = siteConfig.siteUrl
  const items = (await getColumns()).slice(0, 50)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(siteConfig.name)} 칼럼</title>
<link>${base}/column</link>
<description>${esc(siteConfig.name)} 변호사들이 쓰는 법률 칼럼</description>
<language>ko</language>
${items
  .map(
    (c) => `<item>
<title>${esc(c.title)}</title>
<link>${base}/column/${c.id}</link>
<guid>${base}/column/${c.id}</guid>
<description>${esc(c.summary ?? "")}</description>
<pubDate>${new Date(c.date).toUTCString()}</pubDate>
</item>`,
  )
  .join("\n")}
</channel>
</rss>`
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
