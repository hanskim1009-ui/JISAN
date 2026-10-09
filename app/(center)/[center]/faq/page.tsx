import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { allCenters, centerBase, getCenter } from "@/lib/centers"
import { centerText } from "@/lib/center-i18n"
import { getCenterPages, subPageAlternates } from "@/lib/center-pages"
import { siteConfig } from "@/lib/site-config"
import { SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"
import { FaqList } from "@/components/center/faq-list"

type Props = { params: Promise<{ center: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allCenters.filter((c) => (getCenterPages(c.slug)?.moreFaqs.length ?? 0) > 0).map((c) => ({ center: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = getCenter((await params).center)
  if (!center) return {}
  const L = centerText(center.lang)
  const title = L.faqTitle(center.name, center.lang && center.lang !== "ko" ? "JISAN" : siteConfig.shortName)
  return { title: { absolute: title }, description: L.faqDesc(center.name), alternates: { canonical: `${centerBase(center)}/faq`, languages: subPageAlternates(center.slug, "faq") } }
}

/** 자주 묻는 질문 전체: /센터/faq — 기본 질문 + 주제별 질문 */
export default async function FaqPage({ params }: Props) {
  const center = getCenter((await params).center)
  const pages = center && getCenterPages(center.slug)
  if (!center || !pages) notFound()
  const groups: [string, { q: string; a: string }[]][] = [[centerText(center.lang).basicQ, center.faqs]]
  for (const f of pages.moreFaqs) {
    const g = groups.find(([c]) => c === f.category)
    if (g) g[1].push({ q: f.q, a: f.a })
    else groups.push([f.category, [{ q: f.q, a: f.a }]])
  }
  const all = groups.flatMap(([, items]) => items)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubHero
        center={center}
        crumbs={[{ label: center.name, href: centerBase(center) }, { label: centerText(center.lang).faq }]}
        kicker={`${center.name} · ${centerText(center.lang).faq}`}
        title={centerText(center.lang).faqPageTitle(all.length)}
        lead={centerText(center.lang).faqPageLead}
      />
      <div className="bg-white px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
          <nav aria-label={centerText(center.lang).faqTopics} className="hidden lg:block">
            <ul className="sticky top-24 space-y-0.5">
              {groups.map(([cat, items]) => (
                <li key={cat}>
                  <a href={`#${encodeURIComponent(cat)}`} className="flex justify-between rounded-lg px-3 py-2 text-[0.9062rem] text-jisan-ink/75 hover:bg-jisan-mist hover:text-jisan-ink">
                    {cat} <span className="tabular-nums text-jisan-ink/40">{items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 max-w-3xl space-y-12">
            {groups.map(([cat, items]) => (
              <section key={cat} id={encodeURIComponent(cat)} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-jisan-ink">{cat}</h2>
                <div className="mt-3">
                  <FaqList items={items} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <ConsultBand center={center} />
    </>
  )
}
