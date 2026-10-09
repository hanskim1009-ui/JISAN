import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { FOREIGN_LANGS } from "@/lib/langs"
import { allCenters, centerBase, getCenter } from "@/lib/centers"
import { getCases, getColumns } from "@/lib/content"
import { allCenterPages } from "@/lib/center-pages"

/** /sitemap.xml - 센터를 추가하면 자동으로 포함됩니다. 네이버 서치어드바이저·구글 서치콘솔에 제출 */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${siteConfig.siteUrl}${path}`
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    ...FOREIGN_LANGS.map((l) => ({ url: url(`/${l}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...allCenters.map((c) => ({ url: url(centerBase(c)), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...allCenters.flatMap((c) => c.lawyers.map((l) => ({ url: url(`${centerBase(c)}/lawyers/${l.slug}`), changeFrequency: "monthly" as const, priority: 0.6 }))),
    ...(
      await Promise.all(
        FOREIGN_LANGS.map(async (l) => [
          ...["/about", "/lawyers", "/consult", "/column"].map((p) => ({ url: url(`/${l}${p}`), changeFrequency: "monthly" as const, priority: 0.6 })),
          ...(await getColumns({ lang: l })).map((c) => ({ url: url(`/${l}/column/${c.id}`), changeFrequency: "yearly" as const, priority: 0.5 })),
        ]),
      )
    ).flat(),
    ...allCenterPages.flatMap((c) => {
      const center = getCenter(c.slug)
      const b = center ? centerBase(center) : `/${c.slug}`
      return [
        ...c.areaPages.map((a) => ({ url: url(`${b}/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
        ...c.guides.map((g) => ({ url: url(`${b}/guide/${g.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
        ...(c.guides.length > 0 ? [{ url: url(`${b}/guide`), changeFrequency: "weekly" as const, priority: 0.6 }] : []),
        ...(c.moreFaqs.length > 0 ? [{ url: url(`${b}/faq`), changeFrequency: "monthly" as const, priority: 0.6 }] : []),
      ]
    }),
    { url: url("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/consult"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/lawyers"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/cases"), changeFrequency: "weekly", priority: 0.8 },
    ...(await getCases()).map((c) => ({ url: url(`/cases/${c.id}`), changeFrequency: "yearly" as const, priority: 0.6 })),
    { url: url("/column"), changeFrequency: "weekly", priority: 0.8 },
    ...(await getColumns()).map((c) => ({ url: url(`/column/${c.id}`), lastModified: c.date, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: url("/diary"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/disclaimer"), changeFrequency: "yearly", priority: 0.2 },
  ]
}
