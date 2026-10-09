import { OG_LOCALE } from "@/lib/langs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { centerBase, getCenter } from "@/lib/centers"
import { centerText } from "@/lib/center-i18n"
import { allCenterPages, getAreaPage, getCenterPages, subPageAlternates } from "@/lib/center-pages"
import { siteConfig } from "@/lib/site-config"
import { AreaArticle, RelatedAreas, SideNav, SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"

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
      <RelatedAreas center={center} pages={pages} current={page.slug} />
      <ConsultBand center={center} title={L.areaBand(page.areaName)} source={`${center.name} · ${page.areaName}`} />
    </>
  )
}
