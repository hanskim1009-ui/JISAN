import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { getCases, getColumns } from "@/lib/content"
import { allCenterPages } from "@/lib/center-pages"

/** /sitemap.xml - 센터를 추가하면 자동으로 포함됩니다. 네이버 서치어드바이저·구글 서치콘솔에 제출 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.siteUrl}${path}`
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    ...centers.map((c) => ({ url: url(`/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...allCenterPages.flatMap((c) => [
      ...c.areaPages.map((a) => ({ url: url(`/${c.slug}/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
      ...c.guides.map((g) => ({ url: url(`/${c.slug}/guide/${g.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ]),
    { url: url("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/consult"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/lawyers"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/cases"), changeFrequency: "weekly", priority: 0.8 },
    ...getCases().map((c) => ({ url: url(`/cases/${c.id}`), changeFrequency: "yearly" as const, priority: 0.6 })),
    { url: url("/column"), changeFrequency: "weekly", priority: 0.8 },
    ...getColumns().map((c) => ({ url: url(`/column/${c.id}`), lastModified: c.date, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: url("/diary"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/disclaimer"), changeFrequency: "yearly", priority: 0.2 },
  ]
}
