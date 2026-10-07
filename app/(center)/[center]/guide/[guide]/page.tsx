import type { Metadata } from "next"
import Link from "next/link"
import { Phone } from "lucide-react"
import { notFound } from "next/navigation"
import { getCenter } from "@/lib/centers"
import { allCenterPages, getCenterPages, getGuide } from "@/lib/center-pages"
import { siteConfig } from "@/lib/site-config"
import { RelatedAreas, Sections, SideNav, SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"
import { FaqList } from "@/components/center/faq-list"

type Props = { params: Promise<{ center: string; guide: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allCenterPages.flatMap((c) => c.guides.map((g) => ({ center: c.slug, guide: g.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { center: cs, guide } = await params
  const center = getCenter(cs)
  const g = getGuide(cs, guide)
  if (!center || !g) return {}
  const url = `/${cs}/guide/${guide}`
  return {
    title: { absolute: g.seo.title },
    description: g.seo.description,
    keywords: g.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: `${siteConfig.shortName} ${center.name}`,
      title: g.seo.title,
      description: g.seo.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${siteConfig.shortName} ${center.name}` }],
    },
  }
}

/** 상황별 안내 글: /센터/guide/글 */
export default async function GuidePage({ params }: Props) {
  const { center: cs, guide } = await params
  const center = getCenter(cs)
  const pages = getCenterPages(cs)
  const g = getGuide(cs, guide)
  if (!center || !pages || !g) notFound()
  const others = pages.guides.filter((x) => x.slug !== g.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: center.name, item: `${siteConfig.siteUrl}/${cs}` },
          { "@type": "ListItem", position: 2, name: g.title, item: `${siteConfig.siteUrl}/${cs}/guide/${guide}` },
        ],
      },
      ...(g.faqs && g.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
        crumbs={[{ label: center.name, href: `/${cs}` }, { label: "상황별 안내", href: `/${cs}#guides` }, { label: g.title }]}
        kicker={`${center.name} 상황별 안내`}
        title={g.title}
        lead={g.lead}
      />
      <div className="bg-white px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
          <SideNav center={center} pages={pages} current={`guide/${g.slug}`} />
          <article className="min-w-0 max-w-3xl space-y-16">
            <Sections sections={g.sections} />
            <section className="rounded-2xl bg-jisan-ink p-6 text-white md:p-7">
              <p className="text-lg font-bold">이 상황, 혼자 판단하기 어려우시면</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                상담 전화는 24시간, 주말·공휴일에도 받습니다. 지금 겪고 계신 일을 말씀해 주시면 담당 변호사가 다음에 할 일을 알려드립니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold tabular-nums text-jisan-ink">
                  <Phone className="h-4 w-4" /> {siteConfig.phone}
                </a>
                <a href="#consult" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                  상담 신청 남기기
                </a>
              </div>
            </section>
            {g.faqs && g.faqs.length > 0 && (
              <section>
                <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold tracking-tight text-jisan-ink">자주 묻는 질문</h2>
                <div className="mt-4">
                  <FaqList items={g.faqs} />
                </div>
              </section>
            )}
            {others.length > 0 && (
              <section className="rounded-2xl bg-jisan-mist/60 p-6">
                <p className="text-sm font-bold text-jisan-ink/60">이어서 읽어 보세요</p>
                <ul className="mt-2 space-y-1">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/${cs}/guide/${o.slug}`} className="text-[16px] font-semibold text-jisan-ink underline-offset-4 hover:underline">
                        {o.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </div>
      <RelatedAreas center={center} pages={pages} current="" />
      <ConsultBand center={center} source={`${center.name} · ${g.title}`} />
    </>
  )
}
