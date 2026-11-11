import { OG_LOCALE } from "@/lib/langs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { centerBase, getCenter } from "@/lib/centers"
import { centerText } from "@/lib/center-i18n"
import { allCenterPages, getAreaPage, getCenterPages, subPageAlternates } from "@/lib/center-pages"
import { siteConfig } from "@/lib/site-config"
import { serviceSchema } from "@/lib/service-schema"
import { AreaArticle, RelatedAreas, SideNav, SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"
import Link from "next/link"
import { getCases } from "@/lib/content"
import { casesForArea } from "@/lib/case-areas"
import { CasesTable } from "@/components/cases-table"

type Props = { params: Promise<{ center: string; area: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allCenterPages.flatMap((c) => c.areaPages.map((a) => ({ center: c.slug, area: a.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { center: cs, area } = await params
  const center = getCenter(cs)
  const page = getAreaPage(cs, area)
  if (!center || !page) return {}
  const url = `${center ? centerBase(center) : `/${cs}`}/${area}`
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: url, languages: subPageAlternates(center.slug, page.slug) },
    openGraph: {
      type: "article",
      locale: OG_LOCALE[center.lang ?? "ko"],
      url,
      siteName: `${siteConfig.shortName} ${center.name}`,
      title: page.seo.title,
      description: page.seo.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${siteConfig.shortName} ${center.name}` }],
    },
  }
}

/** 업무분야 상세 페이지: /센터/분야 */
export default async function AreaPage({ params }: Props) {
  const { center: cs, area } = await params
  const center = getCenter(cs)
  const pages = getCenterPages(cs)
  const page = getAreaPage(cs, area)
  if (!center || !pages || !page) notFound()
  const L = centerText(center.lang)
  const base = centerBase(center)
  // 이 분야의 업무사례 (lib/case-areas.ts 의 규칙으로 가려냄). 한국어 센터만
  const areaCases = center.lang && center.lang !== "ko" ? [] : casesForArea(await getCases(), center.slug, page.slug)
  const shownCases = areaCases.slice(0, 6)
  // '전체 보기'는 이 분야 사례가 가장 많이 속한 갈래의 목록으로
  const groupCount = new Map<string, number>()
  for (const c of areaCases) if (c.group) groupCount.set(c.group, (groupCount.get(c.group) ?? 0) + 1)
  const caseGroup = [...groupCount.entries()].sort((x, y) => y[1] - x[1])[0]?.[0]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: center.name, item: `${siteConfig.siteUrl}${base}` },
          { "@type": "ListItem", position: 2, name: page.title, item: `${siteConfig.siteUrl}${base}/${area}` },
        ],
      },
      serviceSchema(center, { name: page.areaName, description: page.seo.description, path: `${base}/${area}`, keywords: page.seo.keywords }),
      ...(page.faqs && page.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]
        : []),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubHero
        center={center}
        crumbs={[{ label: center.name, href: base }, { label: L.navAreas, href: `${base}#areas` }, { label: page.areaName }]}
        kicker={L.areaKicker(center.name)}
        title={page.title}
        lead={page.lead}
      />
      <div className="bg-white px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
          <SideNav center={center} pages={pages} current={page.slug} />
          <AreaArticle center={center} page={page} />
        </div>
      </div>
      {shownCases.length > 0 && (
        <section id="cases" className="scroll-mt-24 border-t border-[#E4E6E9] bg-white px-6 md:px-12 lg:px-20 py-14 md:py-16">
          <div data-reveal className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-xl font-bold text-jisan-ink">{page.areaName} 업무사례</h2>
              <Link href={caseGroup ? `/cases?group=${encodeURIComponent(caseGroup)}` : "/cases"} className="text-sm text-jisan-ink underline underline-offset-4">
                {caseGroup ? `${caseGroup} 업무사례 전체 보기` : "업무사례 전체 보기"}
              </Link>
            </div>
            <p className="mt-2 mb-5 text-[0.9375rem] text-jisan-ink/70">
              이 분야에서 맡았던 사건 {areaCases.length}건{areaCases.length > shownCases.length ? ` 가운데 ${shownCases.length}건` : ""}입니다.
            </p>
            <CasesTable items={shownCases} tabs={false} />
            <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">{L.casesNote}</p>
          </div>
        </section>
      )}
      <RelatedAreas center={center} pages={pages} current={page.slug} />
      <ConsultBand center={center} title={L.areaBand(page.areaName)} source={`${center.name} · ${page.areaName}`} />
    </>
  )
}
