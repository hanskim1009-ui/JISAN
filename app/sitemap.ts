import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { FOREIGN_LANGS } from "@/lib/langs"
import { allCenters, centerBase, getCenter } from "@/lib/centers"
import { getCases, getColumns } from "@/lib/content"
import { allCenterPages } from "@/lib/center-pages"
import { TOOLS } from "@/lib/tools/registry"
import { toolsFor } from "@/components/tools/pages/tools-list"
import { visaList } from "@/lib/visa"
import { crimePageIds, crimePageLangs } from "@/lib/tools/prosecution-page"
import { regions, regionBase } from "@/lib/regions"
import { LANGS } from "@/lib/langs"

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
    { url: url("/tools"), changeFrequency: "monthly", priority: 0.7 },
    ...TOOLS.map((x) => ({ url: url(x.href), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...FOREIGN_LANGS.flatMap((l) => {
      const list = toolsFor(l)
      return list.length === 0
        ? []
        : [
            { url: url(`/${l}/tools`), changeFrequency: "monthly" as const, priority: 0.6 },
            ...list.map((x) => ({ url: url(`/${l}${x.href}`), changeFrequency: "monthly" as const, priority: 0.6 })),
          ]
    }),
    // 구형 계산기 죄명 안내 페이지와 죄명 모음 (외국어는 번역된 죄명만)
    ...crimePageLangs().flatMap((l) => {
      const pre = l === "ko" ? "" : `/${l}`
      return [
        { url: url(`${pre}/tools/prosecution/crimes`), changeFrequency: "monthly" as const, priority: 0.6 },
        ...crimePageIds(l).map((id) => ({ url: url(`${pre}/tools/prosecution/${id}`), changeFrequency: "monthly" as const, priority: 0.5 })),
      ]
    }),
    ...LANGS.flatMap((l) => {
      const list = visaList(l)
      const pre = l === "ko" ? "" : `/${l}`
      return list.length === 0
        ? []
        : [
            { url: url(`${pre}/visa`), changeFrequency: "monthly" as const, priority: 0.7 },
            ...list.map((v) => ({ url: url(`${pre}/visa/${v.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
          ]
    }),
    ...regions.flatMap((r) =>
      ["", "/about", "/consult"].map((p) => ({ url: url(`${regionBase(r)}${p}`), changeFrequency: "monthly" as const, priority: p ? 0.5 : 0.8 })),
    ),
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/disclaimer"), changeFrequency: "yearly", priority: 0.2 },
  ]
}
