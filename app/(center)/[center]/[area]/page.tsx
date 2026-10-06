import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCenter } from "@/lib/centers"
import { allCenterPages, getAreaPage, getCenterPages } from "@/lib/center-pages"
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
  const url = `/${cs}/${area}`
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ko_KR",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: center.name, item: `${siteConfig.siteUrl}/${cs}` },
          { "@type": "ListItem", position: 2, name: page.title, item: `${siteConfig.siteUrl}/${cs}/${area}` },
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
        crumbs={[{ label: center.name, href: `/${cs}` }, { label: "업무분야", href: `/${cs}#areas` }, { label: page.areaName }]}
        kicker={`${center.name} 업무분야`}
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
      <ConsultBand center={center} title={`${page.areaName} 사건, 먼저 상의해 보세요.`} source={`${center.name} · ${page.areaName}`} />
    </>
  )
}
